import 'reflect-metadata';
import './server/di/register-defaults';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { env } = await import('./env');
    const { container } = await import('./server/di/container');
    const { WorkersService } = await import('./server/queue/workers');
    const workersService = container.resolve(WorkersService);

    if (env.WORKERS_ENABLED) {
      try {
        await workersService.startWorkers();
        console.log('Queue workers started via instrumentation');
      } catch (error) {
        console.error('Failed to start queue workers via instrumentation:', error);
      }
    } else {
      console.log('Queue workers disabled via env');
    }
  }
}
