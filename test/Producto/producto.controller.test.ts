import { Test } from "@nestjs/testing";
import {
  Producto,
  ProductoController,
  ProductoRepository,
  ProductoRequestDTO,
} from "src/Productos";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { createRandomProducto } from "test/Factory/producto.factory";

const moduleMocker = new ModuleMocker(global);

describe("ProductoController", () => {
  let productoController: ProductoController;
  let productos: Producto[];
  let producto: Producto;

  beforeAll(() => {
    productos = new Array(10).fill(0).map(() => createRandomProducto());
    producto = productos[0];
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductoController],
    })
      .useMocker((token) => {
        if (token === ProductoRepository) {
          return {
            getAll: jest.fn().mockResolvedValue(productos),
            getOne: jest.fn().mockResolvedValue(producto),
            getPage: jest.fn().mockResolvedValue({ productos: productos, page: 1, total: 10 }),
            updateOne: jest.fn((partialProducto: ProductoRequestDTO) => {
              const newProductoRequestDto = {
                ...ProductoRequestDTO.fromProducto(producto),
                ...partialProducto,
              };

              return ProductoRequestDTO.toProducto(newProductoRequestDto, `${producto.id}`);
            }),
            createOne: jest.fn().mockResolvedValue(producto),
            knex: jest.fn(),
          } as unknown as ProductoRepository;
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
      expect(await productoController.getOne("1")).toEqual(producto);
    });
  });

  describe("updateOne", () => {
    it("should return a producto", async () => {
      const updatedProducto = {
        ...producto,
        nombre: "Nombre modificado",
      };
      expect(
        await productoController.updateOne("1", {
          nombre: "Nombre modificado",
        } as ProductoRequestDTO),
      ).toEqual(updatedProducto);
    });
  });
});
