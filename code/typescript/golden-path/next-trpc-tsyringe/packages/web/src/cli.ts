import 'reflect-metadata';

import { container } from 'tsyringe';
import './server/di/register-defaults';
import { createCaller } from './server/api/root';
import { createInnerTRPCContext } from './server/api/trpc';
import { DatabaseService } from './server/db/database-service';
import { InstagramSavedPostsCLI } from './server/scraper/scraper';
import { env } from './server/scraper/scraper-env';
import { SavedDataUploader } from './server/scraper/uploader';

const databaseService = container.resolve(DatabaseService);

main()
  .catch((error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('💥 Unhandled error:', errorMessage);
    process.exit(1);
  })
  .finally(async () => {
    // @TODO: debug why not working
    await container.dispose();
    await databaseService.db.$client.end();
    container.dispose();
  });

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const mapper = {
    upload,
    scrape,
    invokeTrpc,
  };

  const fn = mapper[args[0] as keyof typeof mapper];
  if (!fn) {
    console.error(`unknown option ${args[0]}, should be <${Object.keys(mapper).join('|')}>`);
    process.exit(1);
  }

  await fn(args.slice(1));
}

async function upload(args: string[]) {
  const fileArg = args.find((arg) => arg.startsWith('--file='));
  const filePath = fileArg ? fileArg.split('=')[1] : 'saved.json';
  const urlArg = args.find((arg) => arg.startsWith('--url='));
  const webUrl = urlArg ? urlArg.split('=')[1] : env.WEB_API;
  const timeoutArg = args.find((arg) => arg.startsWith('--timeout='));
  const timeout = timeoutArg ? parseInt(timeoutArg.split('=')[1]!, 10) : 30000;

  console.log('🎯 Upload Configuration:');
  console.log(`   - File: ${filePath}`);
  console.log(`   - Web URL: ${webUrl}`);
  console.log(`   - Timeout: ${timeout}ms`);
  console.log('');

  try {
    const uploader = new SavedDataUploader(webUrl /*, timeout*/);
    const connected = await uploader.testConnection();
    if (!connected) {
      console.warn('⚠️ Connection test failed, but proceeding anyway...');
    }

    const result = await uploader.uploadSavedData({ filePath, timeout });

    if (!result.success) {
      console.error('💥 Upload failed:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
      process.exit(1);
    }

    console.log('🎉 Upload completed successfully!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('💥 Upload failed:', errorMessage);
    process.exit(1);
  }
}

async function scrape(args: string[]) {
  // Scrape mode (default behavior)
  const getDetails = args.includes('--details') || args.includes('-d');
  const scrollsArg = args.find((arg) => arg.startsWith('--scrolls='));
  const maxScrolls = scrollsArg ? parseInt(scrollsArg.split('=')[1]!, 10) : 10;
  const outputArg = args.find((arg) => arg.startsWith('--output='));
  const outputFile = outputArg ? outputArg.split('=')[1] : 'saved.json';

  const cli = new InstagramSavedPostsCLI();

  console.log('🎯 Scrape Configuration:');
  console.log(`   - Get post details: ${getDetails ? 'Yes' : 'No'}`);
  console.log(`   - Max scrolls: ${maxScrolls}`);
  console.log(`   - Output file: ${outputFile}`);
  console.log(`   - Headless mode: ${env.HEADLESS}`);
  console.log('');

  await cli.run({
    getDetails,
    maxScrolls,
    outputFile,
  });
}

async function invokeTrpc(args: string[]) {
  const trpc = createCaller(createInnerTRPCContext({}));
  // @ts-expect-error
  const result = await trpc[args[0]][args[1]](JSON.parse(args[2]));
  console.log(result);
}
