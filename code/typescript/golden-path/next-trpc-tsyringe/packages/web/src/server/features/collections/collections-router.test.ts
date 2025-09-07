import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createTestApp, TestAppCtx } from '../../test-utils/create-test-app';
import type { CollectionData } from './collections-service';

describe('CollectionsRouter test', () => {
  let ctx: TestAppCtx;
  let globalIdCounter = 0;

  beforeAll(async () => {
    ctx = await createTestApp();
  });

  afterAll(async () => {
    await ctx?.teardown();
  });

  beforeEach(async () => {
    await ctx.cleanup();
  });

  it('should get all collections via tRPC', async () => {
    // First import some test data directly through service
    const collectionsData: CollectionData[] = [
      {
        id: String(globalIdCounter++),
        user: 'testuser',
        name: 'Test Collection',
        url: 'https://instagram.com/testuser/saved/test-collection',
        posts: [
          {
            id: String(globalIdCounter++),
            url: 'https://instagram.com/p/post1',
          },
        ],
      },
    ];

    // Import via the collections router
    await ctx.caller.collections.importSavedCollections(collectionsData);

    // Test getting all collections
    const collections = await ctx.caller.collections.getAllCollections();

    expect(collections).toHaveLength(1);
    expect(collections[0]).toMatchObject({
      user: 'testuser',
      name: 'Test Collection',
    });
    expect(collections[0]?.posts).toHaveLength(1);
  });

  it('should get collection by id via tRPC', async () => {
    const collectionId = String(globalIdCounter++);
    const collectionsData: CollectionData[] = [
      {
        id: collectionId,
        user: 'testuser',
        name: 'Test Collection',
        url: 'https://instagram.com/testuser/saved/test-collection',
        posts: [],
      },
    ];

    await ctx.caller.collections.importSavedCollections(collectionsData);

    const collection = await ctx.caller.collections.getCollectionById({ id: collectionId });

    expect(collection).toBeDefined();
    expect(collection).toMatchObject({
      id: collectionId,
      user: 'testuser',
      name: 'Test Collection',
    });
  });

  it('should handle collections by user via tRPC', async () => {
    const collectionsData: CollectionData[] = [
      {
        id: String(globalIdCounter++),
        user: 'user1',
        name: 'Collection 1',
        url: 'https://instagram.com/user1/saved/collection1',
        posts: [],
      },
      {
        id: String(globalIdCounter++),
        user: 'user2',
        name: 'Collection 2',
        url: 'https://instagram.com/user2/saved/collection2',
        posts: [],
      },
    ];

    await ctx.caller.collections.importSavedCollections(collectionsData);

    const user1Collections = await ctx.caller.collections.getCollectionsByUser({ user: 'user1' });

    expect(user1Collections).toHaveLength(1);
    expect(user1Collections[0]?.user).toBe('user1');
    expect(user1Collections[0]?.name).toBe('Collection 1');
  });
});
