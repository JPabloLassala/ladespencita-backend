import { HttpException, HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ProductoController, ProductoAdapter, ProductoEntity } from "src/modules/producto";
import { ProductoService } from "src/modules/producto/producto.service";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi } from "vitest";
import { createRandomProducto } from "test/factory/producto.factory";

const moduleMocker = new ModuleMocker(global);

describe("ProductoController", () => {
  let productoController: ProductoController;
  let productos: ProductoEntity[];
  let producto: ProductoEntity;

  beforeAll(() => {
    productos = new Array(10).fill(0).map(() => createRandomProducto());
    producto = productos[0];
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductoController],
    })
      .useMocker(token => {
        if (token === ProductoAdapter) {
          return {
            getAll: vi.fn().mockResolvedValue(productos),
            getOne: vi.fn().mockResolvedValue(producto),
            getPage: vi.fn().mockResolvedValue({ productos: productos, page: 1, total: 10 }),
            updateOne: vi.fn((partialProducto: Partial<ProductoEntity>) => {
              const newProductoRequestDto = {
                ...partialProducto,
              };

              return newProductoRequestDto;
            }),
            createOne: vi.fn().mockResolvedValue(producto),
            knex: vi.fn(),
          } as unknown as ProductoAdapter;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    productoController = moduleRef.get(ProductoController);
  });

  describe("getAll", () => {
    it("should return an array of productos", async () => {
      expect(await productoController.getAll()).toStrictEqual(productos);
    });
  });

  describe("getOne", () => {
    it("should return a producto", async () => {
      expect(await productoController.getOne(1)).toEqual(producto);
    });
  });

  // Finding 4: GET /in-stock should read from @Query, not @Body
  describe("getProductosBetweenDates", () => {
    let productoServiceMock: { getProductosBetweenDates: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      productoServiceMock = {
        getProductosBetweenDates: vi.fn().mockResolvedValue([]),
      };

      const moduleRef = await Test.createTestingModule({
        controllers: [ProductoController],
      })
        .useMocker(token => {
          if (token === ProductoAdapter) {
            return {
              getAll: vi.fn().mockResolvedValue(productos),
              getOne: vi.fn().mockResolvedValue(producto),
              createOne: vi.fn().mockResolvedValue(producto),
              updateOne: vi.fn().mockResolvedValue(producto),
              knex: vi.fn(),
            } as unknown as ProductoAdapter;
          }
          if (token === ProductoService) {
            return productoServiceMock;
          }
          if (typeof token === "function") {
            const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
            const Mock = moduleMocker.generateFromMetadata(mockMetadata);
            return new Mock();
          }
        })
        .compile();

      productoController = moduleRef.get(ProductoController);
    });

    it("should pass since and until as dayjs objects to the service when called with Date query params", async () => {
      const since = new Date("2025-01-01");
      const until = new Date("2025-01-31");

      await productoController.getProductosBetweenDates({ since, until });

      expect(productoServiceMock.getProductosBetweenDates).toHaveBeenCalledOnce();
      const callArgs = productoServiceMock.getProductosBetweenDates.mock.calls[0][0];
      expect(callArgs.since.toDate()).toEqual(since);
      expect(callArgs.until.toDate()).toEqual(until);
    });
  });

  // Finding 5: updateOne should not return 304 on error
  describe("updateOne — error handling", () => {
    let productoServiceMock: { updateOne: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      productoServiceMock = {
        updateOne: vi.fn().mockRejectedValue(new Error("update failed")),
      };

      const moduleRef = await Test.createTestingModule({
        controllers: [ProductoController],
      })
        .useMocker(token => {
          if (token === ProductoAdapter) {
            return {
              getAll: vi.fn().mockResolvedValue(productos),
              getOne: vi.fn().mockResolvedValue(producto),
              createOne: vi.fn().mockResolvedValue(producto),
              updateOne: vi.fn().mockResolvedValue(producto),
              knex: vi.fn(),
            } as unknown as ProductoAdapter;
          }
          if (token === ProductoService) {
            return productoServiceMock;
          }
          if (typeof token === "function") {
            const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
            const Mock = moduleMocker.generateFromMetadata(mockMetadata);
            return new Mock();
          }
        })
        .compile();

      productoController = moduleRef.get(ProductoController);
    });

    it("should NOT throw an HttpException with status 304 when service throws", async () => {
      const dto = { body: { id: 1, nombre: "test" } } as any;

      await expect(productoController.updateOne(dto, undefined, 1)).rejects.toSatisfy(
        (err: unknown) => {
          if (err instanceof HttpException) {
            return err.getStatus() !== HttpStatus.NOT_MODIFIED;
          }
          // A plain Error (no try/catch in controller) also passes — the global filter handles it
          return err instanceof Error;
        },
      );
    });
  });
});
