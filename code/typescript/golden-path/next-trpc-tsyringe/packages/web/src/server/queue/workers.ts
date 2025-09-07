import { singleton } from 'tsyringe';
import { ParseInstagramPostHandler } from '~/server/features/posts/handlers/parse-instagram-post-handler';
import { UploadInstagramPostHandler } from '~/server/features/posts/handlers/upload-instagram-post-handler';
import { QueueService } from './index';
import { JOB_TYPES } from './jobs';

@singleton()
export class WorkersService {
  private workersStarted = false;

  constructor(
    private queueService: QueueService,
    private parseInstagramPostHandler: ParseInstagramPostHandler,
    private uploadInstagramPostHandler: UploadInstagramPostHandler,
  ) {}

  async startWorkers(): Promise<void> {
    const boss = await this.queueService.getBoss();

    // Prevent multiple worker registrations
    if (this.workersStarted) {
      console.log('Workers already started, skipping...');
      return;
    }

    this.workersStarted = true;

    // Parse Instagram post worker
    await boss.createQueue(JOB_TYPES.PARSE_INSTAGRAM_POST);
    await boss.work(
      JOB_TYPES.PARSE_INSTAGRAM_POST,
      this.parseInstagramPostHandler.handle.bind(this.parseInstagramPostHandler),
    );

    await boss.createQueue(JOB_TYPES.UPLOAD_INSTAGRAM_POST);
    await boss.work(
      JOB_TYPES.UPLOAD_INSTAGRAM_POST,
      this.uploadInstagramPostHandler.handle.bind(this.uploadInstagramPostHandler),
    );

    console.log('Instagram post parser worker started successfully');
  }

  async stopWorkers(): Promise<void> {
    const boss = await this.queueService.getBoss();
    await boss.stop();
    this.workersStarted = false;
    console.log('All queue workers stopped');
  }
}
