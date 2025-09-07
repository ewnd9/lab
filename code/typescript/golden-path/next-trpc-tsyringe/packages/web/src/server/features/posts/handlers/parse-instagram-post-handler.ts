import { eq } from 'drizzle-orm';
import type { Job } from 'pg-boss';
import { injectable } from 'tsyringe';
import { parseInstagramPost } from '~/server/clients/instagram-api';
import { DatabaseService } from '~/server/db/database-service';
import { posts, profiles } from '~/server/db/schema';
import {
  JOB_TYPES,
  JobsService,
  type ParseInstagramPostPayload,
  type UploadInstagramPostPayload,
} from '~/server/queue/jobs';

@injectable()
export class ParseInstagramPostHandler {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jobsService: JobsService,
  ) {}

  private extractPostIdFromUrl(url: string): string {
    const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!match || !match[1]) {
      throw new Error(`Could not extract post ID from URL: ${url}`);
    }
    return match[1];
  }

  async handle(jobs: Job<ParseInstagramPostPayload>[]): Promise<void> {
    const db = this.databaseService.db;

    for (const job of jobs) {
      console.log(`Parsing Instagram post job: ${job.id}`);

      try {
        const { url, collectionId, postId } = job.data;

        console.log(`Parsing Instagram post: ${url} for collection ${collectionId}`);

        // Extract the shortcode from the URL
        const shortcode = this.extractPostIdFromUrl(url);

        // Parse the Instagram post using the new parser
        const instagramData = await parseInstagramPost({ postId: shortcode });
        console.log(`Extracted data for ${url}:`, instagramData);

        // Create or update profile if we have profile data
        let profileDbId = null;
        if (instagramData.owner?.id && instagramData.owner?.username) {
          const existingProfile = await db
            .select()
            .from(profiles)
            .where(eq(profiles.id, instagramData.owner.id))
            .limit(1);

          if (existingProfile.length > 0) {
            // Update existing profile
            await db
              .update(profiles)
              .set({
                username: instagramData.owner.username,
                displayName: instagramData.owner.fullName,
                profileUrl: `https://instagram.com/${instagramData.owner.username}`,
                updatedAt: new Date(),
              })
              .where(eq(profiles.id, instagramData.owner.id));
            profileDbId = instagramData.owner.id;
          } else {
            // Create new profile
            await db.insert(profiles).values({
              id: instagramData.owner.id,
              username: instagramData.owner.username,
              displayName: instagramData.owner.fullName,
              profileUrl: `https://instagram.com/${instagramData.owner.username}`,
            });
            profileDbId = instagramData.owner.id;
          }
        }

        // Update the post in the database with extracted information
        if (postId) {
          await db
            .update(posts)
            .set({
              profileId: profileDbId,
              shortcode,
              description: instagramData.description,
              parsedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(posts.id, postId));
        }

        console.log(`Successfully parsed and updated post ${url}`);

        const jobPayload: UploadInstagramPostPayload = {
          url: job.data.url,
          collectionId: job.data.collectionId,
          postId: job.data.postId,
        };

        await this.jobsService.addJob(JOB_TYPES.UPLOAD_INSTAGRAM_POST, jobPayload);
      } catch (error) {
        console.error(`Failed to parse Instagram post job ${job.id}:`, error);
        throw error; // This will cause the job to retry
      }
    }
  }
}
