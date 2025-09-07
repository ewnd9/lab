import { singleton } from 'tsyringe';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { JobsService } from './jobs-service';

const JobStateSchema = z.enum(['created', 'retry', 'active', 'completed', 'cancelled', 'failed']);

@singleton()
export class JobsRouter {
  constructor(private jobsService: JobsService) {}

  getRouter() {
    return createTRPCRouter({
      // Get job statistics by state
      getStats: publicProcedure.query(async () => {
        return await this.jobsService.getStats();
      }),

      // Get recent jobs
      getRecentJobs: publicProcedure
        .input(
          z.object({
            limit: z.number().default(50),
            state: JobStateSchema.optional(),
          }),
        )
        .query(async ({ input }) => {
          return await this.jobsService.getRecentJobs(input.limit, input.state);
        }),

      // Get failed jobs with details
      getFailedJobs: publicProcedure.input(z.object({ limit: z.number().default(25) })).query(async ({ input }) => {
        return await this.jobsService.getFailedJobs(input.limit);
      }),

      // Get active/running jobs
      getActiveJobs: publicProcedure.query(async () => {
        return await this.jobsService.getActiveJobs();
      }),

      // Cancel a job
      cancelJob: publicProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(async ({ input }) => {
        return await this.jobsService.cancelJob(input.id, input.name);
      }),

      // Retry a failed job
      retryJob: publicProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(async ({ input }) => {
        return await this.jobsService.retryJob(input.id, input.name);
      }),

      // Get queue information
      getQueues: publicProcedure.query(async () => {
        return await this.jobsService.getQueues();
      }),
    });
  }
}
