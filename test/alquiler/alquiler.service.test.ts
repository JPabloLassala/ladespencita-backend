import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { AlquilerService } from "src/modules/alquiler/alquiler.service";
import { AlquilerAdapter } from "src/modules/alquiler/alquiler.adapter";
import { AlquilerProductoService } from "src/modules/alquiler-producto/alquiler-producto.service";
import { getDataSourceToken } from "@nestjs/typeorm";

const moduleMocker = new ModuleMocker(global);

// Finding 10: getAlquiler returns null with 200 OK
describe("AlquilerService.getAlquiler", () => {
  let service: AlquilerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AlquilerService],
    })
      .useMocker(token => {
        if (token === AlquilerAdapter) {
          return {
            getAlquiler: vi.fn().mockResolvedValue(null),
          } as unknown as AlquilerAdapter;
        }
        if (token === AlquilerProductoService) {
          return {
            deleteByAlquilerId: vi.fn().mockResolvedValue(undefined),
          } as unknown as AlquilerProductoService;
        }
        if (token === getDataSourceToken()) {
          return {
            transaction: vi.fn(),
          };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(AlquilerService);
  });

  it("should throw NotFoundException when alquiler is not found", async () => {
    await expect(service.getAlquiler(999)).rejects.toThrow(NotFoundException);
  });
});

// Finding 9: Non-transactional delete of alquiler and its productos
describe("AlquilerService.deleteAlquiler", () => {
  let service: AlquilerService;
  let mockManager: {
    delete: ReturnType<typeof vi.fn>;
  };
  let mockDataSource: {
    transaction: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // mockManager.delete fails on the second call (deleting the alquiler itself)
    mockManager = {
      delete: vi
        .fn()
        .mockResolvedValueOnce(undefined) // first call: delete alquiler-productos succeeds
        .mockRejectedValueOnce(new Error("DB error")), // second call: delete alquiler fails
    };

    mockDataSource = {
      transaction: vi
        .fn()
        .mockImplementation((cb: (manager: typeof mockManager) => Promise<void>) =>
          cb(mockManager),
        ),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [AlquilerService],
    })
      .useMocker(token => {
        if (token === AlquilerAdapter) {
          return {
            deleteOne: vi.fn().mockRejectedValue(new Error("DB error")),
          } as unknown as AlquilerAdapter;
        }
        if (token === AlquilerProductoService) {
          return {
            deleteByAlquilerId: vi.fn().mockResolvedValue(undefined),
          } as unknown as AlquilerProductoService;
        }
        if (token === getDataSourceToken()) {
          return mockDataSource;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(AlquilerService);
  });

  it("should throw when the inner delete fails (atomic behavior)", async () => {
    await expect(service.deleteAlquiler(1)).rejects.toThrow("DB error");
  });

  it("should execute both deletes inside a single transaction callback", async () => {
    // The transaction callback runs and fails on second delete
    await expect(service.deleteAlquiler(1)).rejects.toThrow();

    // DataSource.transaction must have been called exactly once (proves atomicity)
    expect(mockDataSource.transaction).toHaveBeenCalledOnce();

    // manager.delete must have been called twice: once for junction records, once for the alquiler
    expect(mockManager.delete).toHaveBeenCalledTimes(2);

    // First delete: junction records by alquilerId
    const [, firstArgs] = mockManager.delete.mock.calls[0];
    expect(firstArgs).toEqual({ alquilerId: 1 });

    // Second delete: alquiler itself by id
    const [, secondArgs] = mockManager.delete.mock.calls[1];
    expect(secondArgs).toEqual({ id: 1 });
  });
});
