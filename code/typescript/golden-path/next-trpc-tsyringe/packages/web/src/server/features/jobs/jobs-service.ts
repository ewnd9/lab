import type PgBoss from 'pg-boss';
import { singleton } from 'tsyringe';
import { conn } from '~/server/db';
import { QueueService } from '~/server/queue';

interface DbJob {
  id: string;
  name: string;
  priority: number;
  data: unknown;
  state: 'created' | 'retry' | 'active' | 'completed' | 'cancelled' | 'failed';
  retry_limit: number;
  retry_count: number;
  retry_delay: number;
  retry_backoff: boolean;
  start_after: Date;
  started_on: Date | null;
  singleton_key: string | null;
  singleton_on: Date | null;
  expire_in: string;
  created_on: Date;
  completed_on: Date | null;
  keep_until: Date;
  output: unknown | null;
  dead_letter: string | null;
  policy: string | null;
}

interface ActiveDbJob {
  id: string;
  name: string;
  data: unknown;
  started_on: Date | null;
  created_on: Date;
}

@singleton()
export class JobsService {
  constructor(private readonly queueService: QueueService) {}

  async getStats() {
    const boss = await this.queueService.getBoss();
    const stats = await (boss as any).countStates();

    const byState = Object.entries(stats)
      .filter(([key]) => !['queues', 'all'].includes(key))
      .map(([state, count]) => ({
        state,
        count: count as number,
      }));

    return {
      byState,
      total: stats.all as number,
    };
  }

  async getRecentJobs(limit: number = 50, state?: string) {
    const jobs: DbJob[] = state
      ? await conn`
          SELECT
            id,
            name,
            data,
            state,
            retry_count,
            retry_limit,
            start_after,
            started_on,
            completed_on,
            created_on
          FROM pgboss.job
          WHERE state = ${state}
          ORDER BY created_on DESC
          LIMIT ${limit}
        `
      : await conn`
          SELECT
            id,
            name,
            data,
            state,
            retry_count,
            retry_limit,
            start_after,
            started_on,
            completed_on,
            created_on
          FROM pgboss.job
          ORDER BY created_on DESC
          LIMIT ${limit}
        `;

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: typeof job.data === 'string' ? JSON.parse(job.data) : job.data,
      state: job.state,
      retry_count: job.retry_count,
      retry_limit: job.retry_limit,
      start_after: job.start_after,
      started_on: job.started_on,
      completed_on: job.completed_on,
      created_on: job.created_on,
      updated_on: job.created_on,
    }));
  }

  async getFailedJobs(limit: number = 25) {
    const jobs: DbJob[] = await conn`
        SELECT
          id,
          name,
          data,
          state,
          retry_count,
          retry_limit,
          output,
          created_on,
          completed_on
        FROM pgboss.job
        WHERE state = 'failed'
        ORDER BY completed_on DESC
        LIMIT ${limit}
      `;

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: typeof job.data === 'string' ? JSON.parse(job.data) : job.data,
      state: job.state,
      retry_count: job.retry_count,
      retry_limit: job.retry_limit,
      created_on: job.created_on,
      completed_on: job.completed_on,
      output: typeof job.output === 'string' ? JSON.parse(job.output) : job.output,
    }));
  }

  async getActiveJobs() {
    const jobs: ActiveDbJob[] = await conn`
      SELECT
        id,
        name,
        data,
        started_on,
        created_on
      FROM pgboss.job
      WHERE state = 'active'
      ORDER BY started_on DESC
    `;

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: typeof job.data === 'string' ? JSON.parse(job.data) : job.data,
      started_on: job.started_on,
      created_on: job.created_on,
    }));
  }

  async cancelJob(id: string, name: string) {
    const boss = await this.queueService.getBoss();
    await boss.cancel(name, id);
    return { success: true };
  }

  async retryJob(id: string, name: string) {
    const boss = await this.queueService.getBoss();
    await boss.retry(name, id);
    return { success: true };
  }

  async getQueues() {
    const boss = await this.queueService.getBoss();
    const queues = await boss.getQueues();

    return queues.map((queue: PgBoss.QueueResult) => ({
      name: queue.name,
      policy: queue.policy,
      retry_limit: queue.retryLimit,
      retry_delay: queue.retryDelay,
      retry_backoff: queue.retryBackoff,
      expire_in: queue.expireInSeconds,
      retention_minutes: queue.retentionMinutes,
      created_on: queue.createdOn,
      updated_on: queue.updatedOn,
    }));
  }
}
