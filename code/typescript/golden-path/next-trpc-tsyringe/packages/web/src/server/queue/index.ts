import PgBoss from 'pg-boss';
import { singleton } from 'tsyringe';
import { env } from '~/env';
import { QueueSetupService } from './setup';

@singleton()
export class QueueService {
  private bossInstance: PgBoss | null = null;

  constructor(private setupService: QueueSetupService) {}

  async getBoss(): Promise<PgBoss> {
    if (!this.bossInstance) {
      console.log(`initializing pg boss ${Date.now()}`);

      // Setup database extensions first
      await this.setupService.setupDatabase();

      this.bossInstance = new PgBoss({
        connectionString: env.DATABASE_URL,
        schema: 'pgboss',
      });

      this.bossInstance.on('error', (error) => {
        console.error('PgBoss error:', error);
      });

      await this.bossInstance.start();
      console.log('PgBoss started successfully');
    }

    return this.bossInstance;
  }

  async closeBoss(): Promise<void> {
    if (this.bossInstance) {
      await this.bossInstance.stop();
      this.bossInstance = null;
      console.log('PgBoss stopped');
    }
  }
}

export { PgBoss };
export type { Job, JobOptions } from 'pg-boss';
