import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { IMAGE_MODEL, S3 } from "src/constants";
import { Image } from "./Imge.entity";
import { ImageSchema } from "./image.schema";

@Injectable()
export class ImageRepository {
  constructor(
    @Inject(S3) private readonly s3: S3Client,
    @Inject(IMAGE_MODEL) private readonly imageModel: typeof ImageSchema,
  ) {}

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

  async createOne(file: Express.Multer.File, productoId: number): Promise<Image> {
    try {
      const uploadedFile = await this.uploadFile(file);
      const createdImage = await this.imageModel.create({
        productoId: +productoId,
        url: uploadedFile.file,
      });

      return createdImage;
    } catch (error) {
      throw new Error("Create failed");
    }
  }
}
