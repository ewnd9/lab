import { desc } from 'drizzle-orm';
import { singleton } from 'tsyringe';
import { posts } from '~/server/db/schema';
import { DatabaseService } from '../../db/database-service';

@singleton()
export class PostsService {
  constructor(private databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async getLatestPost() {
    const post = await this.db.query.posts.findFirst({
      orderBy: [desc(posts.createdAt)],
    });

    return post ?? null;
  }
}
