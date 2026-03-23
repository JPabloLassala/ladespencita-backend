import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { ImageController } from "src/modules/image/image.controller";
import { ImageService } from "src/modules/image/image.service";

const moduleMocker = new ModuleMocker(global);

describe("ImageController", () => {
  let controller: ImageController;
  let serviceMock: {
    create: ReturnType<typeof vi.fn>;
  };

  const fakeImage = { id: 1, url: "https://cdn.example.com/1/1.webp", productoId: 1 };

  beforeEach(async () => {
    serviceMock = {
      create: vi.fn().mockResolvedValue([fakeImage]),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ImageController],
    })
      .useMocker(token => {
        if (token === ImageService) {
          return serviceMock;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(ImageController);
  });

  describe("createOne", () => {
    it("should call imageService.create with parsed productoId", async () => {
      const file = { buffer: Buffer.from("fake"), originalname: "img.jpg" } as Express.Multer.File;

      const result = await controller.createOne(file, "42");

      expect(serviceMock.create).toHaveBeenCalledWith(file, 42);
      expect(result).toStrictEqual([fakeImage]);
    });
  });

  describe("uploadFiles", () => {
    it("should call imageService.create for each file and return all results", async () => {
      const file1 = {
        buffer: Buffer.from("a"),
        originalname: "a.jpg",
      } as Express.Multer.File;
      const file2 = {
        buffer: Buffer.from("b"),
        originalname: "b.jpg",
      } as Express.Multer.File;

      const result = await controller.uploadFiles({ files: [file1, file2] }, 1);

      expect(serviceMock.create).toHaveBeenCalledTimes(2);
      expect(serviceMock.create).toHaveBeenCalledWith(file1, 1);
      expect(serviceMock.create).toHaveBeenCalledWith(file2, 1);
      expect(result).toHaveLength(2);
    });
  });
});
