import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { ProductoService } from "src/modules/producto/producto.service";
import { ProductoAdapter } from "src/modules/producto/producto.adapter";
import { ImageService } from "src/modules/image/image.service";
import { AlquilerProductoAdapter } from "src/modules/alquiler-producto";
import { AlquilerAdapter } from "src/modules/alquiler";

const moduleMocker = new ModuleMocker(global);

describe("ProductoService", () => {
  describe("updateOne — upload-first strategy (Finding 8)", () => {
    let service: ProductoService;
    let imageServiceMock: {
      deleteManyFromProducto: ReturnType<typeof vi.fn>;
      deleteManyByIds: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
    let productoAdapterMock: {
      updateOne: ReturnType<typeof vi.fn>;
      getOne: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
      imageServiceMock = {
        deleteManyFromProducto: vi.fn().mockResolvedValue(undefined),
        deleteManyByIds: vi.fn().mockResolvedValue(undefined),
        create: vi.fn().mockRejectedValue(new Error("S3 upload failed")),
      };

      productoAdapterMock = {
        updateOne: vi.fn().mockResolvedValue({ id: 1, images: [] }),
        getOne: vi.fn().mockResolvedValue({ id: 1, images: [] }),
      };

      const moduleRef = await Test.createTestingModule({
        providers: [ProductoService],
      })
        .useMocker(token => {
          if (token === ImageService) {
            return imageServiceMock;
          }
          if (token === ProductoAdapter) {
            return productoAdapterMock;
          }
          if (token === AlquilerProductoAdapter) {
            return { getProductosFromAlquilerIds: vi.fn().mockResolvedValue([]) };
          }
          if (token === AlquilerAdapter) {
            return {
              getAlquileresBetweenDates: vi.fn().mockResolvedValue([]),
              getAlquileresWithProductoId: vi.fn().mockResolvedValue([]),
            };
          }
          if (typeof token === "function") {
            const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
            const Mock = moduleMocker.generateFromMetadata(mockMetadata);
            return new Mock();
          }
        })
        .compile();

      service = moduleRef.get(ProductoService);
    });

    it("should reject when image upload fails (S3 error propagates)", async () => {
      const fakeMulterFile = {
        buffer: Buffer.from(""),
        originalname: "test.jpg",
      } as Express.Multer.File;

      await expect(
        service.updateOne({ id: 1, nombre: "test" }, fakeMulterFile),
      ).rejects.toThrow("S3 upload failed");
    });

    it("should NOT call deleteManyFromProducto when image upload fails (upload-first strategy)", async () => {
      const fakeMulterFile = {
        buffer: Buffer.from(""),
        originalname: "test.jpg",
      } as Express.Multer.File;

      await expect(
        service.updateOne({ id: 1, nombre: "test" }, fakeMulterFile),
      ).rejects.toThrow("S3 upload failed");

      expect(imageServiceMock.deleteManyFromProducto).not.toHaveBeenCalled();
    });
  });
});
