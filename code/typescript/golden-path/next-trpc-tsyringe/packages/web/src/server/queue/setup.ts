import { singleton } from 'tsyringe';
import { conn } from '~/server/db';

@singleton()
export class QueueSetupService {
  async setupDatabase(): Promise<void> {
    try {
      // Try to create the pgcrypto extension if it doesn't exist
      await conn`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
      console.log('pgcrypto extension enabled');
    } catch (error) {
      console.warn('Could not enable pgcrypto extension:', error);

      // If pgcrypto fails, try to create a fallback function
      try {
        await conn`
          CREATE OR REPLACE FUNCTION gen_random_uuid() RETURNS uuid AS $$
            SELECT md5(random()::text || clock_timestamp()::text)::uuid;
          $$ LANGUAGE SQL;
        `;
        console.log('Created fallback gen_random_uuid function');
      } catch (fallbackError) {
        console.warn('Could not create fallback UUID function:', fallbackError);
      }
    }
  }
}
