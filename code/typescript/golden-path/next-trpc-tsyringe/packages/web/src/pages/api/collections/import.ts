import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { NextApiRequest, NextApiResponse } from 'next';
import { collections, posts } from '~/server/db/schema';
import { container } from '~/server/di/container';
import type { ParseInstagramPostPayload } from '~/server/queue/jobs';
import { JOB_TYPES, JobsService } from '~/server/queue/jobs';
import { DatabaseService } from '../../../server/db/database-service';

const ajv = new Ajv();
addFormats(ajv);

type ApiResponse = {
  success: boolean;
  message: string;
  data?: {
    collectionsProcessed: number;
    postsProcessed: number;
    jobsQueued: number;
  };
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Load and compile the JSON schema
    const schemaPath = path.join(process.cwd(), '..', 'shared', 'saved.schema.json');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    const validate = ajv.compile(schema);

    // Validate the request body against the schema
    const isValid = validate(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        error: JSON.stringify(validate.errors),
      });
    }

    const collectionsData = req.body as Array<{
      user: string;
      name: string;
      id: string;
      url: string;
      posts: Array<{
        id: string;
        url: string;
      }>;
    }>;

    let collectionsProcessed = 0;
    let postsProcessed = 0;
    let jobsQueued = 0;
    const errors: string[] = [];

    const databaseService = container.resolve(DatabaseService);

    // Process each collection
    for (const collection of collectionsData) {
      try {
        // Insert or update collection
        await databaseService.db
          .insert(collections)
          .values({
            id: collection.id,
            user: collection.user,
            name: collection.name,
            url: collection.url,
          })
          .onConflictDoUpdate({
            target: collections.id,
            set: {
              user: collection.user,
              name: collection.name,
              url: collection.url,
              updatedAt: new Date(),
            },
          });

        collectionsProcessed++;

        // Process posts for this collection
        for (const post of collection.posts) {
          try {
            await databaseService.db
              .insert(posts)
              .values({
                id: post.id,
                url: post.url,
                collectionId: collection.id,
              })
              .onConflictDoUpdate({
                target: posts.id,
                set: {
                  url: post.url,
                  collectionId: collection.id,
                  updatedAt: new Date(),
                },
              });

            postsProcessed++;

            // Queue Instagram post parsing job
            try {
              const jobPayload: ParseInstagramPostPayload = {
                url: post.url,
                collectionId: collection.id,
                postId: post.id,
              };

              const jobsService = container.resolve(JobsService);
              await jobsService.addJob(JOB_TYPES.PARSE_INSTAGRAM_POST, jobPayload);

              jobsQueued++;
            } catch (jobError) {
              errors.push(`Failed to queue parsing job for post ${post.id}: ${jobError}`);
            }
          } catch (postError) {
            errors.push(`Failed to process post ${post.id}: ${postError}`);
          }
        }
      } catch (collectionError) {
        errors.push(`Failed to process collection ${collection.id}: ${collectionError}`);
      }
    }

    // Return success response with processing details
    const response: ApiResponse = {
      success: true,
      message: `Successfully processed ${collectionsProcessed} collections, ${postsProcessed} posts, and queued ${jobsQueued} parsing jobs`,
      data: {
        collectionsProcessed,
        postsProcessed,
        jobsQueued,
      },
    };

    if (errors.length > 0) {
      response.error = `Some items failed to process: ${errors.join('; ')}`;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
