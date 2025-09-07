import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import type { Database } from '~/server/db';
import * as schema from '~/server/db/schema';

export class TestDatabase {
  private container?: StartedPostgreSqlContainer;
  public db?: Database;
  public connection?: postgres.Sql;

  async start(): Promise<void> {
    this.container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpass')
      .withExposedPorts(5432)
      .start();

    const connectionString = this.container.getConnectionUri();

    this.connection = postgres(connectionString, {
      max: 10,
    });

    this.db = drizzle(this.connection, { schema });

    // Run migrations
    await this.runMigrations();
  }

  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
    }
    if (this.container) {
      await this.container.stop();
    }
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await migrate(this.db, { migrationsFolder: './drizzle' });
  }

  async cleanup(): Promise<void> {
    if (!this.connection) return;

    // Clean up all tables
    await this.connection`TRUNCATE TABLE web_post CASCADE`;
    await this.connection`TRUNCATE TABLE web_collection CASCADE`;
    await this.connection`TRUNCATE TABLE web_profile CASCADE`;
  }

  getConnectionString(): string {
    if (!this.container) throw new Error('Container not started');
    return this.container.getConnectionUri();
  }
}
