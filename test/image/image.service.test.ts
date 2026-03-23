// vi.mock calls are hoisted before imports by Vitest. We mock the image barrel
// to break the circular import chain:
//   image.service → image.entity → src/modules/producto (barrel) →
//   producto.module → src/modules/image (barrel) → image.module →
//   TypeOrmModule.forFeature([ImageEntity])  ← fires before ImageEntity is ready
// By mocking the image barrel, producto.module never loads image.module,
// so TypeOrmModule.forFeature is never called during module resolution.
vi.mock("src/modules/image", () => ({}));

import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeAll, beforeEach, it, expect } from "vitest";
import { ImageService } from "src/modules/image/image.service";
import { S3 } from "src/common/constants/s3";
import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

// getRepositoryToken(ImageEntity) returns `${entity.name}Repository` = "ImageEntityRepository"
// Use the token string directly to avoid importing ImageEntity (which re-triggers the chain).
const IMAGE_ENTITY_REPOSITORY_TOKEN = "ImageEntityRepository";

const moduleMocker = new ModuleMocker(global);

describe("ImageService", () => {
  let imageService: ImageService;
  let s3SendMock: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    process.env.S3_BUCKET_NAME = "my-bucket";
    process.env.BACKBLAZE_BUCKET = "different-bucket";
  });

  beforeEach(async () => {
    s3SendMock = vi.fn();
    // First call: ListObjectsV2Command — return one object to delete
    s3SendMock.mockResolvedValueOnce({ Contents: [{ Key: "1/1.webp" }] });
    // Second call: DeleteObjectsCommand — return empty success
    s3SendMock.mockResolvedValueOnce({});

    const moduleRef = await Test.createTestingModule({
      providers: [ImageService],
    })
      .useMocker(token => {
        if (token === S3) {
          return { send: s3SendMock };
        }
        if (token === IMAGE_ENTITY_REPOSITORY_TOKEN) {
          return { delete: vi.fn().mockResolvedValue(undefined) };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    imageService = moduleRef.get(ImageService);
  });

  describe("deleteManyFromProducto", () => {
    it("uses S3_BUCKET_NAME for all S3 commands — ListObjectsV2Command and DeleteObjectsCommand must not use BACKBLAZE_BUCKET", async () => {
      await imageService.deleteManyFromProducto(1);

      expect(s3SendMock).toHaveBeenCalledTimes(2);

      const calls = s3SendMock.mock.calls;

      // Verify command types
      expect(calls[0][0]).toBeInstanceOf(ListObjectsV2Command);
      expect(calls[1][0]).toBeInstanceOf(DeleteObjectsCommand);

      // Assert ALL bucket values equal process.env.S3_BUCKET_NAME
      const buckets = calls.map(([cmd]) => cmd.input.Bucket);
      for (const bucket of buckets) {
        expect(bucket).toBe(process.env.S3_BUCKET_NAME);
      }
    });
  });
});
