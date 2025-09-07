import { singleton } from 'tsyringe';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { CollectionsService } from './collections-service';

const postSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
});

const collectionSchema = z.object({
  user: z.string().min(1).max(30),
  name: z.string().min(1).max(255),
  id: z.string().regex(/^\d+$/),
  url: z.string().url(),
  posts: z.array(postSchema),
});

const savedCollectionsSchema = z.array(collectionSchema);

@singleton()
export class CollectionsRouter {
  constructor(private collectionsService: CollectionsService) {}

  getRouter() {
    return createTRPCRouter({
      importSavedCollections: publicProcedure.input(savedCollectionsSchema).mutation(async ({ input }) => {
        return await this.collectionsService.importSavedCollections(input);
      }),

      getAllCollections: publicProcedure.query(async () => {
        return await this.collectionsService.getAllCollections();
      }),

      getCollectionById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        return await this.collectionsService.getCollectionById(input.id);
      }),

      getCollectionsByUser: publicProcedure.input(z.object({ user: z.string() })).query(async ({ input }) => {
        return await this.collectionsService.getCollectionsByUser(input.user);
      }),
    });
  }
}
