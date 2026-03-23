import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { AlquilerAdapter } from "src/modules/alquiler/alquiler.adapter";
import { AlquilerEntity } from "src/modules/alquiler/alquiler.entity";
import { createRandomAlquiler } from "test/factory/alquiler.factory";
import dayjs from "dayjs";

const moduleMocker = new ModuleMocker(global);

describe("AlquilerAdapter", () => {
  let adapter: AlquilerAdapter;
  let repo: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const alquileres = Array.from({ length: 3 }, () => createRandomAlquiler());

  beforeEach(async () => {
    repo = {
      find: vi.fn().mockResolvedValue(alquileres),
      findOneBy: vi.fn().mockResolvedValue(alquileres[0]),
      save: vi.fn().mockImplementation(entity => Promise.resolve(entity)),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [AlquilerAdapter],
    })
      .useMocker(token => {
        if (token === getRepositoryToken(AlquilerEntity)) {
          return repo;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    adapter = moduleRef.get(AlquilerAdapter);
  });

  describe("getAlquileres", () => {
    it("should return all alquileres with productos relation", async () => {
      const result = await adapter.getAlquileres();

      expect(result).toStrictEqual(alquileres);
      expect(repo.find).toHaveBeenCalledWith({
        relations: { productos: true },
        order: { updatedAt: "DESC", createdAt: "DESC" },
      });
    });
  });

  describe("getAlquiler", () => {
    it("should return a single alquiler by id", async () => {
      const result = await adapter.getAlquiler(1);

      expect(result).toStrictEqual(alquileres[0]);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("createOne", () => {
    it("should save and return the new alquiler", async () => {
      const newAlquiler = { productora: "Test", proyecto: "Proj" } as any;

      const result = await adapter.createOne(newAlquiler);

      expect(repo.save).toHaveBeenCalledWith(newAlquiler);
      expect(result).toEqual(newAlquiler);
    });
  });

  describe("updateOne", () => {
    it("should merge existing alquiler with partial update and save", async () => {
      const partial = { id: alquileres[0].id, productora: "Updated" } as any;

      await adapter.updateOne(partial);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: partial.id });
      expect(repo.save).toHaveBeenCalledWith({ ...alquileres[0], ...partial });
    });
  });

  describe("deleteOne", () => {
    it("should delete by id", async () => {
      await adapter.deleteOne(1);

      expect(repo.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("getAlquileresBetweenDates", () => {
    it("should call find with date range filters", async () => {
      const since = dayjs("2025-01-01");
      const until = dayjs("2025-01-31");

      await adapter.getAlquileresBetweenDates({ since, until });

      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe("getAlquileresWithProductoId", () => {
    it("should query alquileres by productoId in productos relation", async () => {
      await adapter.getAlquileresWithProductoId(5);

      expect(repo.find).toHaveBeenCalledWith({
        where: { productos: { productoId: 5 } },
      });
    });
  });
});
