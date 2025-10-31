import {
  _Object,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
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

  async createOne(file: Express.Multer.File, productoId: number): Promise<Image> {
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
  }

  async deleteManyFromProducto(productoId: string) {
    await this.deleteFilesFromProducto(productoId);
    await this.imageModel.destroy({
      where: {
        productoId: productoId,
      },
    });
  }

  private async deleteFilesFromProducto(productoId: string): Promise<void> {
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

  private async getUploadedFilesFromProducto(
    productoId: string,
  ): Promise<ListObjectsV2CommandOutput> {
    return await this.s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Prefix: `${productoId}/`,
      }),
    );
  }
}
