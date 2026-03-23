import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { AlquilerProductoService } from "src/modules/alquiler-producto/alquiler-producto.service";
import { AlquilerProductoAdapter } from "src/modules/alquiler-producto/alquiler-producto.adapter";
import { AlquilerProductoUpdate } from "src/modules/alquiler-producto/alquiler-producto.entity";

const moduleMocker = new ModuleMocker(global);

describe("AlquilerProductoService", () => {
  let service: AlquilerProductoService;
  let adapter: {
    createMany: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    const createMany = vi.fn().mockResolvedValue([]);
    const updateMany = vi.fn().mockResolvedValue([]);
    const deleteMany = vi.fn().mockResolvedValue(undefined);

    adapter = { createMany, updateMany, deleteMany };

    const moduleRef = await Test.createTestingModule({
      providers: [AlquilerProductoService],
    })
      .useMocker(token => {
        if (token === AlquilerProductoAdapter) {
          return adapter as unknown as AlquilerProductoAdapter;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(AlquilerProductoService);
  });

  describe("updateAlquilerProductos", () => {
    it("should NOT include cantidad=0 items in updateMany, but should include them in deleteMany", async () => {
      const itemToUpdate: AlquilerProductoUpdate = {
        id: 1,
        productoId: 10,
        cantidad: 5,
        alquilerId: 1,
        costoProducto: 100,
        costoGrafica: 0,
        costoDiseno: 0,
        costoTotal: 100,
        precioFinal: 0,
        valorUnitarioGarantia: 0,
        valorTotalGarantia: 0,
        valorUnitarioAlquiler: 0,
        valorX1: 0,
        valorX3: 0,
        valorX6: 0,
        valorX12: 0,
        createdAt: new Date(),
      };

      const itemToDelete: AlquilerProductoUpdate = {
        id: 2,
        productoId: 11,
        cantidad: 0,
        alquilerId: 1,
        costoProducto: 100,
        costoGrafica: 0,
        costoDiseno: 0,
        costoTotal: 100,
        precioFinal: 0,
        valorUnitarioGarantia: 0,
        valorTotalGarantia: 0,
        valorUnitarioAlquiler: 0,
        valorX1: 0,
        valorX3: 0,
        valorX6: 0,
        valorX12: 0,
        createdAt: new Date(),
      };

      await service.updateAlquilerProductos([itemToUpdate, itemToDelete], 1);

      // The item with cantidad=0 must NOT appear in the updateMany call
      const updateManyArg: AlquilerProductoUpdate[] = adapter.updateMany.mock.calls[0][0];
      const idsPassedToUpdate = updateManyArg.map(ap => ap.id);
      expect(idsPassedToUpdate).not.toContain(2);

      // The item with cantidad=0 must appear in the deleteMany call
      expect(adapter.deleteMany).toHaveBeenCalledWith([2]);
    });
  });
});
