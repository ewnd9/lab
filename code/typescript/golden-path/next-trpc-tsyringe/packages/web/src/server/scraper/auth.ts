import fs from 'node:fs';
import path from 'node:path';
import { type Browser, chromium, type Page } from '@playwright/test';

export class InstagramAuth {
  private username: string;
  private password: string;
  private headless: boolean;
  private sessionDir: string;
  public browser: Browser | null = null;
  public page: Page | null = null;

  constructor(username: string, password: string, headless: boolean = true) {
    this.username = username;
    this.password = password;
    this.headless = headless;
    this.sessionDir = path.resolve('browser-session');
  }

  async initBrowser(): Promise<void> {
    console.log(this.sessionDir);
    // Ensure session directory exists
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }

    const context = await chromium.launchPersistentContext(this.sessionDir, {
      headless: this.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    });

    this.browser = context as any; // Type compatibility
    this.page = context.pages()[0] || (await context.newPage());
  }

  async login(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initBrowser() first.');
    }

    try {
      console.log('Checking if already logged in...');
      await this.page.goto('https://www.instagram.com/', {
        waitUntil: 'domcontentloaded',
      });

      // Check if already logged in by looking for user-specific elements
      const isLoggedIn =
        (await this.page.locator('[data-testid="search-input"]').count()) > 0 ||
        (await this.page.locator('a[href="/direct/inbox/"]').count()) > 0;

      if (isLoggedIn) {
        console.log('Already logged in from previous session');
        return true;
      }

      console.log('Not logged in, proceeding with login...');
      await this.page.goto('https://www.instagram.com/accounts/login/', {
        waitUntil: 'networkidle',
      });

      await this.page.waitForSelector('input[name="username"]', {
        timeout: 10000,
      });

      console.log('Entering credentials...');
      await this.page.fill('input[name="username"]', this.username);
      await this.page.fill('input[name="password"]', this.password);
      await this.page.click('button[type="submit"]');

      console.log('Waiting for login to complete...');
      await this.page.waitForURL(/^(?!.*\/accounts\/login\/).*$/, {
        timeout: 15000,
      });

      const currentUrl = this.page.url();

      if (currentUrl.includes('/accounts/login/') || currentUrl.includes('/challenge/')) {
        throw new Error('Login failed - check credentials or handle 2FA manually');
      }

      if (currentUrl.includes('/accounts/onetap/')) {
        await this.page.click('button[type="button"]');
        await this.page.waitForURL(/^(?!.*\/accounts\/onetap\/).*$/);
      }

      console.log('Successfully logged in to Instagram');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Login failed:', errorMessage);
      throw error;
    }
  }

  async navigateToSavedPosts(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initBrowser() first.');
    }

    try {
      console.log('Navigating to saved posts...');
      await this.page.goto(`https://www.instagram.com/${this.username}/saved/`, {
        waitUntil: 'domcontentloaded',
      });

      await this.page.waitForSelector('[aria-label="Saved collections"]', { timeout: 10000 });
      console.log('Successfully navigated to saved posts');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to navigate to saved posts:', errorMessage);
      throw error;
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      console.log('Closing browser (session will be preserved)...');
      await this.browser.close();
    }
  }
}
