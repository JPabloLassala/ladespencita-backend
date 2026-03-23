import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { ProductoAdapter } from "src/modules/producto/producto.adapter";
import { ProductoEntity } from "src/modules/producto/producto.entity";
import { createRandomProducto } from "test/factory/producto.factory";

const moduleMocker = new ModuleMocker(global);

describe("ProductoAdapter", () => {
  let adapter: ProductoAdapter;
  let repo: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  const productos = Array.from({ length: 3 }, () => createRandomProducto());

  beforeEach(async () => {
    repo = {
      find: vi.fn().mockResolvedValue(productos),
      findOne: vi.fn().mockResolvedValue(productos[0]),
      save: vi.fn().mockImplementation(entity => Promise.resolve(entity)),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ProductoAdapter],
    })
      .useMocker(token => {
        if (token === getRepositoryToken(ProductoEntity)) {
          return repo;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    adapter = moduleRef.get(ProductoAdapter);
  });

  describe("getAll", () => {
    it("should return all productos with images relation ordered by nombre ASC", async () => {
      const result = await adapter.getAll();

      expect(result).toStrictEqual(productos);
      expect(repo.find).toHaveBeenCalledWith({
        relations: { images: true },
        order: { nombre: "ASC" },
      });
    });
  });

  describe("getOne", () => {
    it("should return a single producto by id with images", async () => {
      const result = await adapter.getOne(1);

      expect(result).toStrictEqual(productos[0]);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: { images: true } });
    });
  });

  describe("getStockPerId", () => {
    it("should return a Map of id -> totales", async () => {
      const result = await adapter.getStockPerId();

      expect(result).toBeInstanceOf(Map);
      for (const p of productos) {
        expect(result.get(p.id)).toBe(p.totales);
      }
    });
  });

  describe("deleteOne", () => {
    it("should remove the producto when found", async () => {
      await adapter.deleteOne(productos[0].id);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: productos[0].id } });
      expect(repo.remove).toHaveBeenCalledWith(productos[0]);
    });

    it("should return null when producto is not found", async () => {
      repo.findOne.mockResolvedValueOnce(null);

      const result = await adapter.deleteOne(999);

      expect(result).toBeNull();
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });

  describe("createOne", () => {
    it("should save and return the new producto", async () => {
      const newProducto = { nombre: "Test", totales: 10 } as any;

      await adapter.createOne(newProducto);

      expect(repo.save).toHaveBeenCalledWith(newProducto);
    });
  });

  describe("updateOne", () => {
    it("should save partial with id", async () => {
      const partial = { id: 1, nombre: "Updated" } as Partial<ProductoEntity>;

      await adapter.updateOne(partial);

      expect(repo.save).toHaveBeenCalledWith({ id: 1, nombre: "Updated" });
    });
  });
});
