import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    INSTAGRAM_USERNAME: z.string().min(1, 'INSTAGRAM_USERNAME is required'),
    INSTAGRAM_PASSWORD: z.string().min(1, 'INSTAGRAM_PASSWORD is required'),
    HEADLESS: z
      .string()
      .default('true')
      .transform((val) => val === 'true'),
    WEB_API: z.string().url().default('http://localhost:3000'),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME,
    INSTAGRAM_PASSWORD: process.env.INSTAGRAM_PASSWORD,
    HEADLESS: process.env.HEADLESS,
    WEB_API: process.env.WEB_API,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
