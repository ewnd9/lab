import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { singleton } from 'tsyringe';
import { env } from '~/env';

@singleton()
export class S3Service implements Disposable {
  public readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      region: env.AWS_REGION,
      endpoint: env.AWS_ENDPOINT_URL,
    });
  }

  async [Symbol.dispose](): Promise<void> {}

  async uploadArrayBuffer(key: string, contentType: string, arrayBuffer: ArrayBuffer): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: contentType,
      }),
    );

    return key;
  }
}
