import { TestDatabase } from './test-database';

export interface TestAppCtx {
  caller: ReturnType<typeof import('~/server/api/root').createCaller>;
  cleanup: () => Promise<void>;
  teardown: () => Promise<void>;
}

export async function createTestApp(): Promise<TestAppCtx> {
  const testDb = new TestDatabase();
  await testDb.start();

  const { DatabaseService } = await import('~/server/db/database-service');
  const databaseService = new DatabaseService(testDb.db!);

  const { container } = await import('~/server/di/container');
  container.register(DatabaseService, { useValue: databaseService });

  const { createInnerTRPCContext } = await import('~/server/api/trpc');
  const ctx = createInnerTRPCContext({});

  const { createCaller } = await import('~/server/api/root');
  const caller = createCaller(ctx);

  return {
    caller,
    async cleanup() {
      await testDb.cleanup();
    },
    async teardown() {
      await testDb.stop();
    },
  };
}
