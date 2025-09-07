import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { container } from '~/server/di/container';
import { CollectionsRouter } from '~/server/features/collections/collections-router';
import { JobsRouter } from '~/server/features/jobs/jobs-router';
import { PostRouter } from '~/server/features/posts/posts-router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
const collectionsRouter = container.resolve(CollectionsRouter);
const jobsRouter = container.resolve(JobsRouter);
const postRouter = container.resolve(PostRouter);

export const appRouter = createTRPCRouter({
  post: postRouter.getRouter(),
  collections: collectionsRouter.getRouter(),
  jobs: jobsRouter.getRouter(),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
