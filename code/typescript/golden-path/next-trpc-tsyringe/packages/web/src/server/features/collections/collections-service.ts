import { desc, eq } from 'drizzle-orm';
import { singleton } from 'tsyringe';
import { collections, posts } from '~/server/db/schema';
import { DatabaseService } from '../../db/database-service';

export interface CollectionData {
  id: string;
  url: string;
  user: string;
  name: string;
  posts: Array<{
    id: string;
    url: string;
  }>;
}

@singleton()
export class CollectionsService {
  constructor(private databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async importSavedCollections(collectionsData: CollectionData[]) {
    const results = [];

    for (const collection of collectionsData) {
      try {
        // Insert or update collection
        await this.db
          .insert(collections)
          .values({
            id: collection.id,
            user: collection.user,
            name: collection.name,
            url: collection.url,
          })
          .onConflictDoUpdate({
            target: collections.id,
            set: {
              user: collection.user,
              name: collection.name,
              url: collection.url,
              updatedAt: new Date(),
            },
          });

        // Insert posts for this collection
        const postsToInsert = collection.posts.map((post) => ({
          id: post.id,
          url: post.url,
          collectionId: collection.id,
        }));

        if (postsToInsert.length > 0) {
          for (const post of postsToInsert) {
            await this.db
              .insert(posts)
              .values(post)
              .onConflictDoUpdate({
                target: posts.id,
                set: {
                  url: post.url,
                  collectionId: post.collectionId,
                  updatedAt: new Date(),
                },
              });
          }
        }

        results.push({
          collectionId: collection.id,
          postsImported: collection.posts.length,
          success: true,
        });
      } catch (error) {
        results.push({
          collectionId: collection.id,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        });
      }
    }

    return {
      collectionsProcessed: collectionsData.length,
      results,
    };
  }

  async getAllCollections() {
    return await this.db.query.collections.findMany({
      orderBy: [desc(collections.updatedAt)],
      with: {
        posts: {
          orderBy: [desc(posts.createdAt)],
          with: {
            profile: true,
          },
        },
      },
    });
  }

  async getCollectionById(id: string) {
    return await this.db.query.collections.findFirst({
      where: eq(collections.id, id),
      with: {
        posts: {
          orderBy: [desc(posts.createdAt)],
          with: {
            profile: true,
          },
        },
      },
    });
  }

  async getCollectionsByUser(user: string) {
    return await this.db.query.collections.findMany({
      where: eq(collections.user, user),
      orderBy: [desc(collections.updatedAt)],
      with: {
        posts: {
          orderBy: [desc(posts.createdAt)],
          with: {
            profile: true,
          },
        },
      },
    });
  }
}
