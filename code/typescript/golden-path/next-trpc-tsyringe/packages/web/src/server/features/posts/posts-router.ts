import { singleton } from 'tsyringe';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { PostsService } from './posts-service';

@singleton()
export class PostRouter {
  constructor(private postsService: PostsService) {}

  getRouter() {
    return createTRPCRouter({
      getLatest: publicProcedure.query(async () => {
        return await this.postsService.getLatestPost();
      }),
    });
  }
}
