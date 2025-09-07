import { type Database } from '~/server/db';

export class DatabaseService implements Disposable {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async [Symbol.dispose](): Promise<void> {
    await this.database.$client.end();
  }

  get db(): Database {
    return this.database;
  }
}
