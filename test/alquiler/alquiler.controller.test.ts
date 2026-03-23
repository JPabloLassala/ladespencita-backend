import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { AlquilerController } from "src/modules/alquiler/alquiler.controller";
import { AlquilerService } from "src/modules/alquiler/alquiler.service";
import { ProductoHigherThanAvailableError } from "src/modules/alquiler/alquiler.error";
import { createRandomAlquiler } from "test/factory/alquiler.factory";
import { ALQUILER_STATUS } from "src/modules/alquiler/alquiler.const";

const moduleMocker = new ModuleMocker(global);

describe("AlquilerController", () => {
  let controller: AlquilerController;
  let serviceMock: {
    getAlquileres: ReturnType<typeof vi.fn>;
    getAlquiler: ReturnType<typeof vi.fn>;
    createAlquiler: ReturnType<typeof vi.fn>;
    updateAlquiler: ReturnType<typeof vi.fn>;
    deleteAlquiler: ReturnType<typeof vi.fn>;
  };

  const alquileres = Array.from({ length: 3 }, () => createRandomAlquiler());

  beforeEach(async () => {
    serviceMock = {
      getAlquileres: vi.fn().mockResolvedValue(alquileres),
      getAlquiler: vi.fn().mockResolvedValue(alquileres[0]),
      createAlquiler: vi.fn().mockResolvedValue(alquileres[0]),
      updateAlquiler: vi.fn().mockResolvedValue(alquileres[0]),
      deleteAlquiler: vi.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AlquilerController],
    })
      .useMocker(token => {
        if (token === AlquilerService) {
          return serviceMock;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(AlquilerController);
  });

  describe("getAll", () => {
    it("should return all alquileres from the service", async () => {
      const result = await controller.getAll();

      expect(result).toStrictEqual(alquileres);
      expect(serviceMock.getAlquileres).toHaveBeenCalledOnce();
    });
  });

  describe("getOne", () => {
    it("should return a single alquiler by id", async () => {
      const result = await controller.getOne(1);

      expect(result).toStrictEqual(alquileres[0]);
      expect(serviceMock.getAlquiler).toHaveBeenCalledWith(1);
    });
  });

  describe("updateAlquiler", () => {
    it("should delegate to service.updateAlquiler", async () => {
      const update = { id: 1, productora: "Updated" } as any;

      const result = await controller.updateAlquiler(update);

      expect(result).toStrictEqual(alquileres[0]);
      expect(serviceMock.updateAlquiler).toHaveBeenCalledWith(update);
    });
  });

  describe("createAlquiler", () => {
    it("should return created alquiler with 201 status", async () => {
      const newAlquiler = {
        productora: "Test",
        proyecto: "Proj",
        status: ALQUILER_STATUS.PENDING,
        fechaPresupuesto: new Date(),
        fechaInicio: new Date(),
        fechaFin: new Date(),
      } as any;

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as any;

      await controller.createAlquiler(newAlquiler, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(alquileres[0]);
    });

    it("should return 400 with error details when ProductoHigherThanAvailableError is thrown", async () => {
      const errorProducts = [{ productoId: 1, used: 5, stock: 3, requested: 8 }];
      serviceMock.createAlquiler.mockRejectedValueOnce(
        new ProductoHigherThanAvailableError(errorProducts),
      );

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as any;

      await controller.createAlquiler({} as any, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "La cantidad de productos solicitados supera la disponibilidad.",
        productos: errorProducts,
      });
    });

    it("should re-throw unexpected errors", async () => {
      serviceMock.createAlquiler.mockRejectedValueOnce(new Error("unexpected"));

      const mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;

      await expect(controller.createAlquiler({} as any, mockRes)).rejects.toThrow("unexpected");
    });
  });

  describe("deleteAlquiler", () => {
    it("should return 204 No Content", async () => {
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
      } as any;

      await controller.deleteAlquiler(1, mockRes);

      expect(serviceMock.deleteAlquiler).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });
});
