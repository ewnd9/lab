import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';

export interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    collectionsProcessed: number;
    postsProcessed: number;
  };
  error?: string;
}

export interface UploadOptions {
  webUrl?: string;
  filePath?: string;
  timeout?: number;
}

export class SavedDataUploader {
  private webUrl: string;
  // private timeout: number;

  constructor(webUrl: string = 'http://localhost:3000' /*, timeout: number = 30000*/) {
    this.webUrl = webUrl.replace(/\/$/, ''); // Remove trailing slash
    // this.timeout = timeout;
  }

  async uploadSavedData(options: UploadOptions = {}): Promise<UploadResult> {
    const { filePath = 'saved.json' /*, timeout = this.timeout */ } = options;

    try {
      console.log('📤 Starting upload process...');

      // Check if file exists
      const fullPath = path.resolve(filePath);

      try {
        await fs.access(fullPath);
      } catch {
        throw new Error(`File not found: ${fullPath}`);
      }

      console.log(`📁 Reading data from: ${fullPath}`);

      // Read and parse the file
      const fileContent = await fs.readFile(fullPath, 'utf-8');
      let jsonData;

      try {
        jsonData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error(`Invalid JSON in file: ${parseError}`);
      }

      // Validate basic structure
      if (!Array.isArray(jsonData)) {
        throw new Error('Expected JSON array of collections');
      }

      console.log(`🔍 Found ${jsonData.length} collections to upload`);
      console.log(`🌐 Uploading to: ${this.webUrl}/api/collections/import`);

      // Upload to web API
      const response = await fetch(`${this.webUrl}/api/collections/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
        // timeout,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = (await response.json()) as UploadResult;

      if (result.success) {
        console.log('✅ Upload completed successfully!');
        console.log(`📊 Collections processed: ${result.data?.collectionsProcessed || 0}`);
        console.log(`📊 Posts processed: ${result.data?.postsProcessed || 0}`);

        if (result.error) {
          console.warn('⚠️ Some warnings occurred:');
          console.warn(result.error);
        }
      } else {
        console.error('❌ Upload failed:');
        console.error(result.message);
        if (result.error) {
          console.error(result.error);
        }
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('💥 Upload failed:', errorMessage);

      return {
        success: false,
        message: 'Upload failed',
        error: errorMessage,
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`🔗 Testing connection to: ${this.webUrl}`);

      const response = await fetch(`${this.webUrl}/api/health`, {
        method: 'GET',
        // timeout: 5000,
      });

      if (response.ok) {
        console.log('✅ Connection successful');
        return true;
      } else {
        console.warn(`⚠️ Connection test returned: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}
