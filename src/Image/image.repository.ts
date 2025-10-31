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

  async uploadFile(
    file: Express.Multer.File,
    productoId: number,
    imageNumber: number,
  ): Promise<{ file: string }> {
    const extension = file.originalname.split(".").pop();
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `${productoId}/${imageNumber}.${extension}`,
        ContentType: file.mimetype,
        Body: file.buffer,
      }),
    );

    return {
      file: `https://f004.backblazeb2.com/file/${process.env.BACKBLAZE_BUCKET}/${productoId}/${imageNumber}.${extension}`,
    };
  }

  async createOne(file: Express.Multer.File, productoId: number): Promise<Image> {
    try {
      const imageNumber = await this.imageModel.count({
        where: {
          productoId: productoId,
        },
      });
      const uploadedFile = await this.uploadFile(file, productoId, imageNumber);
      const createdImage = await this.imageModel.create({
        productoId: +productoId,
        url: uploadedFile.file,
        isMain: true,
      });

      return createdImage;
    } catch (error) {
      throw new Error("Create failed");
    }
  }
}
