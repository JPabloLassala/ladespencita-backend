import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { S3 } from "src/constants";

@Injectable()
export class ImageRepository {
  constructor(@Inject(S3) private readonly s3: S3Client) {}

  async uploadFile(file: Express.Multer.File): Promise<{ file: string }> {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.BACKBLAZE_BUCKET,
          Key: file.originalname,
          ContentType: file.mimetype,
          Body: file.buffer,
        }),
      );

      return {
        file: `https://f004.backblazeb2.com/file/${process.env.BACKBLAZE_BUCKET}/${file.originalname}`,
      };
    } catch (error) {
      throw new Error("Upload failed");
    }
  }
}
