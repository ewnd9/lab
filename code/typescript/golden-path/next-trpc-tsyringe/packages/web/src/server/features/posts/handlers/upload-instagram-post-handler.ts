import { eq } from 'drizzle-orm';
import type { Job } from 'pg-boss';
import { injectable } from 'tsyringe';
import { parseInstagramPost } from '~/server/clients/instagram-api';
import { DatabaseService } from '~/server/db/database-service';
import { posts } from '~/server/db/schema';
import type { ParseInstagramPostPayload } from '~/server/queue/jobs';
import { S3Service } from '~/server/s3/s3-service';

@injectable()
export class UploadInstagramPostHandler {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  private extractPostIdFromUrl(url: string): string {
    const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!match || !match[1]) {
      throw new Error(`Could not extract post ID from URL: ${url}`);
    }
    return match[1];
  }

  async handle(jobs: Job[]): Promise<void> {
    const db = this.databaseService.db;

    for (const job of jobs) {
      console.log(`Parsing Instagram post job: ${job.id}`);

      try {
        const { url, collectionId, postId } = job.data as ParseInstagramPostPayload;

        console.log(`Parsing Instagram post: ${url} for collection ${collectionId}`);

        // Extract the shortcode from the URL
        const shortcode = this.extractPostIdFromUrl(url);

        // Parse the Instagram post using the new parser
        const instagramData = await parseInstagramPost({ postId: shortcode });
        console.log(`Extracted data for ${url}:`, instagramData);

        // @TODO: rewrite to piping
        const [videoUrl, thumbnailSrc, displayUrl] = await Promise.all([
          (async () => {
            const arrayBuffer = await (await fetch(instagramData.videoUrl)).arrayBuffer();
            return this.s3Service.uploadArrayBuffer(
              `instagram-saved/videos/${shortcode}.mp4`,
              'video/mp4',
              arrayBuffer,
            );
          })(),
          (async () => {
            const arrayBuffer = await (await fetch(instagramData.thumbnailSrc)).arrayBuffer();
            return this.s3Service.uploadArrayBuffer(
              `instagram-saved/thumbnails/${shortcode}.jpg`,
              'image/jpeg',
              arrayBuffer,
            );
          })(),
          (async () => {
            const arrayBuffer = await (await fetch(instagramData.displayUrl)).arrayBuffer();
            return this.s3Service.uploadArrayBuffer(
              `instagram-saved/display-image/${shortcode}.jpg`,
              'image/jpeg',
              arrayBuffer,
            );
          })(),
        ]);

        if (postId) {
          await db
            .update(posts)
            .set({
              videoUrl,
              thumbnailSrc,
              displayUrl,
            })
            .where(eq(posts.id, postId));
        }

        console.log(`Successfully uploaded video ${url}`);
      } catch (error) {
        console.error(`Failed to parse Instagram post job ${job.id}:`, error);
        throw error; // This will cause the job to retry
      }
    }
  }
}
