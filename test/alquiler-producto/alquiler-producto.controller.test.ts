import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { AlquilerProductoController } from "src/modules/alquiler-producto/alquiler-producto.controller";
import { AlquilerProductoAdapter } from "src/modules/alquiler-producto/alquiler-producto.adapter";
import { AlquilerProductoService } from "src/modules/alquiler-producto/alquiler-producto.service";
import { createRandomAlquilerProducto } from "test/factory/alquiler-producto.factory";

const moduleMocker = new ModuleMocker(global);

describe("AlquilerProductoController", () => {
  let controller: AlquilerProductoController;
  let adapterMock: {
    getProductosFromAlquiler: ReturnType<typeof vi.fn>;
  };
  let serviceMock: {
    checkRemaining: ReturnType<typeof vi.fn>;
    createMany: ReturnType<typeof vi.fn>;
    updateAlquilerProductos: ReturnType<typeof vi.fn>;
  };

  const alquilerProductos = Array.from({ length: 3 }, () => createRandomAlquilerProducto());

  beforeEach(async () => {
    adapterMock = {
      getProductosFromAlquiler: vi.fn().mockResolvedValue(alquilerProductos),
    };

    serviceMock = {
      checkRemaining: vi.fn().mockResolvedValue([]),
      createMany: vi.fn().mockResolvedValue(alquilerProductos),
      updateAlquilerProductos: vi.fn().mockResolvedValue(alquilerProductos),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AlquilerProductoController],
    })
      .useMocker(token => {
        if (token === AlquilerProductoAdapter) {
          return adapterMock;
        }
        if (token === AlquilerProductoService) {
          return serviceMock;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(AlquilerProductoController);
  });

  describe("checkRemaining", () => {
    it("should delegate to service with query params", async () => {
      const query = {
        since: new Date("2025-01-01"),
        until: new Date("2025-01-31"),
        alquilerId: 5,
      };

      await controller.checkRemaining(query);

      expect(serviceMock.checkRemaining).toHaveBeenCalledWith(query.since, query.until, 5);
    });
  });

  describe("getProductosFromAlquiler", () => {
    it("should return productos for the given alquilerId", async () => {
      const result = await controller.getProductosFromAlquiler(1);

      expect(result).toStrictEqual(alquilerProductos);
      expect(adapterMock.getProductosFromAlquiler).toHaveBeenCalledWith(1);
    });
  });

  describe("createAlquilerProducto", () => {
    it("should delegate to service.createMany with alquilerId", async () => {
      const dtos = [{ productoId: 1, cantidad: 5 }] as any;

      await controller.createAlquilerProducto(dtos, 10);

      expect(serviceMock.createMany).toHaveBeenCalledWith(dtos, 10);
    });
  });

  describe("updatealquilerProductos", () => {
    it("should delegate to service.updateAlquilerProductos with alquilerId", async () => {
      const dtos = [{ id: 1, productoId: 1, cantidad: 3 }] as any;

      await controller.updatealquilerProductos(dtos, 10);

      expect(serviceMock.updateAlquilerProductos).toHaveBeenCalledWith(dtos, 10);
    });
  });
});
