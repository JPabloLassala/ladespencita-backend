import {
  _Object,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { IMAGE_FORMAT, IMAGE_TYPE, S3 } from "src/common/constants";
import { Repository } from "typeorm";
import { ImageEntity } from "./image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import sharp from "sharp";
import dayjs from "dayjs";
import { buffer } from "stream/consumers";

@Injectable()
export class ImageService {
  constructor(
    @Inject(S3) private readonly s3: S3Client,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async create(file: Express.Multer.File, productoId: number): Promise<ImageEntity[]> {
    const [urlThumb, urlGallery, urlFull] = await this.uploadFiles(file, productoId);
    const createdImage = await this.imageRepository.save([
      {
        productoId: +productoId,
        url: urlThumb,
        type: IMAGE_TYPE.THUMBNAIL,
        format: IMAGE_FORMAT.WEBP,
        isMain: false,
      },
      {
        productoId: +productoId,
        url: urlGallery,
        type: IMAGE_TYPE.GALLERY,
        format: IMAGE_FORMAT.WEBP,
        isMain: false,
      },
      {
        productoId: +productoId,
        url: urlFull,
        type: IMAGE_TYPE.FULL,
        format: IMAGE_FORMAT.WEBP,
        isMain: true,
      },
    ]);

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

  private async uploadFiles(file: Express.Multer.File, productoId: number): Promise<string[]> {
    const thumbKey = `${productoId}/${productoId}-200.webp`;
    const galleryKey = `${productoId}/${productoId}-800.webp`;
    const fullKey = `${productoId}/${productoId}.webp`;

    try {
      const thumbBuffer = await sharp(file.buffer)
        .rotate()
        .resize(200)
        .webp({ quality: 80 })
        .toBuffer();
      const galleryBuffer = await sharp(file.buffer)
        .rotate()
        .resize(800)
        .webp({ quality: 80 })
        .toBuffer();
      const fullBuffer = await sharp(file.buffer).rotate().webp({ quality: 90 }).toBuffer();

      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: thumbKey,
          ContentType: "image/webp",
          ContentLength: thumbBuffer.length,
          Body: thumbBuffer,
        }),
      );
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: galleryKey,
          ContentType: "image/webp",
          ContentLength: galleryBuffer.length,
          Body: galleryBuffer,
        }),
      );
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fullKey,
          ContentType: "image/webp",
          ContentLength: fullBuffer.length,
          Body: fullBuffer,
        }),
      );
    } catch (error) {
      console.error("Error uploading file to Backblaze:", error);
      throw error;
    }

    return [
      `${process.env.CDN_BASE_URL}/${thumbKey}`,
      `${process.env.CDN_BASE_URL}/${galleryKey}`,
      `${process.env.CDN_BASE_URL}/${fullKey}`,
    ];
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
