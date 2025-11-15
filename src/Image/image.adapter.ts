import {
  _Object,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { S3 } from "src/constants";
import { Repository } from "typeorm";
import { ImageEntity } from "./image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import sharp from "sharp";
import dayjs from "dayjs";

@Injectable()
export class ImageAdapter {
  constructor(
    @Inject(S3) private readonly s3: S3Client,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async createOne(file: Express.Multer.File, productoId: number): Promise<ImageEntity> {
    const uploadedFile = await this.uploadFile(file, productoId);
    const createdImage = await this.imageRepository.save({
      productoId: +productoId,
      url: uploadedFile.file,
      isMain: true,
    });

    return createdImage;
  }

  async deleteManyFromProducto(productoId: number) {
    await this.deleteFilesFromProducto(productoId);
    await this.imageRepository.delete({
      productoId,
    });
  }

  private async deleteFilesFromProducto(productoId: number): Promise<void> {
    const uploadedFiles = await this.getUploadedFilesFromProducto(productoId);

    console.log(`Deleting files from Backblaze for product ID: ${productoId}`);
    console.log(`Amount of files to delete: ${uploadedFiles.Contents?.length}`);

    if (!uploadedFiles.Contents || uploadedFiles.Contents.length === 0) {
      console.log("No objects found to delete.");
      return;
    }

    console.log(`Object path: ${JSON.stringify(uploadedFiles.Contents[0])} `);

    const deleteImagesCommand = new DeleteObjectsCommand({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Delete: {
        Objects: uploadedFiles.Contents.map((obj: _Object) => ({
          Key: obj.Key!,
        })),
        Quiet: true,
      },
    });

    console.log(`Deleting ${uploadedFiles.Contents.length} objects from Backblaze...`);

    const result = await this.s3.send(deleteImagesCommand);

    console.log("Delete result:", result);
    if (result.Errors?.length) {
      console.error("Errors deleting objects:", result.Errors);
    }
  }

  private async uploadFile(
    file: Express.Multer.File,
    productoId: number,
  ): Promise<{ file: string }> {
    const timeStamp = dayjs().format("YYYYMMDDHHmmssSSS");
    const extension = file.originalname.split(".").pop();
    const jpegBuffer = await sharp(file.buffer)
      .rotate() // auto-orient based on EXIF
      .jpeg({
        quality: 80, // tweak between 60–85 for size vs quality
        mozjpeg: true,
      })
      .toBuffer();
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.BACKBLAZE_BUCKET,
          Key: `${productoId}/${timeStamp}-${productoId}.${extension}`,
          ContentType: "image/jpeg",
          ContentLength: jpegBuffer.length,
          Body: jpegBuffer,
        }),
      );
    } catch (error) {
      console.error("Error uploading file to Backblaze:", error);
      throw error;
    }

    return {
      file: `https://f004.backblazeb2.com/file/${process.env.BACKBLAZE_BUCKET}/${productoId}/${timeStamp}-${productoId}.${extension}`,
    };
  }

  private async getUploadedFilesFromProducto(
    productoId: number,
  ): Promise<ListObjectsV2CommandOutput> {
    return await this.s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Prefix: `${productoId}/`,
      }),
    );
  }
}
