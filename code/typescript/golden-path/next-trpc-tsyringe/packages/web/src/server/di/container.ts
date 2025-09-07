import 'reflect-metadata';
import { container } from 'tsyringe';

// Import classes to ensure decorators are processed
import '~/server/s3/s3-service';
import '~/server/features/collections/collections-service';
import '~/server/features/jobs/jobs-service';
import '~/server/features/posts/posts-service';
import '~/server/features/collections/collections-router';
import '~/server/features/jobs/jobs-router';
import '~/server/features/posts/posts-router';
import '~/server/queue/setup';
import '~/server/queue';
import '~/server/queue/jobs';
import '~/server/queue/workers';
import '~/server/features/posts/handlers/parse-instagram-post-handler';
import '~/server/features/posts/handlers/upload-instagram-post-handler';

export { container };
