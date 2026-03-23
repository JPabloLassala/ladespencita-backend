import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { AlquilerProductoAdapter } from "src/modules/alquiler-producto/alquiler-producto.adapter";
import { AlquilerProductoEntity } from "src/modules/alquiler-producto/alquiler-producto.entity";
import { ProductoEntity } from "src/modules/producto/producto.entity";

const moduleMocker = new ModuleMocker(global);

describe("AlquilerProductoAdapter", () => {
  let adapter: AlquilerProductoAdapter;
  let alquilerProductoRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findBy: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let productoRepo: {
    findOneBy: ReturnType<typeof vi.fn>;
    findBy: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    alquilerProductoRepo = {
      create: vi.fn(),
      save: vi.fn().mockResolvedValue({ id: 99 }),
      findBy: vi.fn().mockResolvedValue([]),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    productoRepo = {
      findOneBy: vi.fn().mockResolvedValue({ id: 10, totales: 100 }),
      findBy: vi.fn().mockResolvedValue([]),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [AlquilerProductoAdapter],
    })
      .useMocker(token => {
        if (token === getRepositoryToken(AlquilerProductoEntity)) {
          return alquilerProductoRepo;
        }
        if (token === getRepositoryToken(ProductoEntity)) {
          return productoRepo;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    adapter = moduleRef.get(AlquilerProductoAdapter);
  });

  describe("createOne", () => {
    it("should call repository.save (not just repository.create) to persist the entity", async () => {
      const newAlquilerProducto = {
        productoId: 10,
        alquilerId: 1,
        cantidad: 1,
        costoProducto: 50,
        costoGrafica: 10,
        costoDiseno: 5,
        costoTotal: 65,
        precioFinal: 65,
        valorUnitarioGarantia: 20,
        valorTotalGarantia: 20,
        valorUnitarioAlquiler: 30,
        valorX1: 30,
        valorX3: 25,
        valorX6: 20,
        valorX12: 15,
      };

      await adapter.createOne(newAlquilerProducto);

      expect(alquilerProductoRepo.save).toHaveBeenCalled();
    });
  });

  describe("deleteMany", () => {
    it("should resolve without error and NOT call repository.delete when given an empty array", async () => {
      await expect(adapter.deleteMany([])).resolves.toBeUndefined();

      expect(alquilerProductoRepo.delete).not.toHaveBeenCalled();
    });
  });
});
