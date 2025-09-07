import type { JobOptions } from 'pg-boss';
import { singleton } from 'tsyringe';
import { QueueService } from './index';

export const JOB_TYPES = {
  PARSE_INSTAGRAM_POST: 'parse-instagram-post',
  UPLOAD_INSTAGRAM_POST: 'upload-instagram-post',
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export interface ParseInstagramPostPayload {
  url: string;
  collectionId: string;
  postId?: string;
}

export interface UploadInstagramPostPayload {
  url: string;
  collectionId: string;
  postId?: string;
}

@singleton()
export class JobsService {
  constructor(private queueService: QueueService) {}

  async addJob<T extends object>(jobType: JobType, payload: T, options?: JobOptions): Promise<string | null> {
    const boss = await this.queueService.getBoss();
    const jobId = await boss.send(jobType, payload, {
      retryLimit: 3,
      retryDelay: 60, // seconds
      ...options,
    });

    console.log(`Added job ${jobType} with ID: ${jobId}`);
    return jobId;
  }

  async scheduleRecurringJob(jobType: JobType, cron: string, payload?: object, options?: JobOptions): Promise<void> {
    const boss = await this.queueService.getBoss();

    await boss.schedule(jobType, cron, payload, {
      retryLimit: 2,
      ...options,
    });

    console.log(`Scheduled recurring job ${jobType} with cron: ${cron}`);
  }
}
