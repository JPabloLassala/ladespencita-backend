import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { SheetService } from "src/modules/sheet/sheet.service";
import { ProductoEntity } from "src/modules/producto/producto.entity";
import { S3 } from "src/common/constants/s3";

const moduleMocker = new ModuleMocker(global);

describe("SheetService", () => {
  let service: SheetService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SheetService],
    })
      .useMocker(token => {
        if (token === getRepositoryToken(ProductoEntity)) {
          return {
            save: vi.fn().mockImplementation(entity => Promise.resolve({ id: 1, ...entity })),
            manager: {
              getRepository: vi.fn().mockReturnValue({
                save: vi.fn().mockResolvedValue([]),
              }),
            },
          };
        }
        if (token === S3) {
          return { send: vi.fn().mockResolvedValue({}) };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(SheetService);
  });

  describe("columnToLetter", () => {
    it("should convert column 0 to A", () => {
      expect(service.columnToLetter(0)).toBe("A");
    });

    it("should convert column 25 to Z", () => {
      expect(service.columnToLetter(25)).toBe("Z");
    });

    it("should convert column 26 to AA", () => {
      expect(service.columnToLetter(26)).toBe("AA");
    });

    it("should convert column 27 to AB", () => {
      expect(service.columnToLetter(27)).toBe("AB");
    });
  });

  describe("toNumber (private, tested via reflection)", () => {
    it("should return null for empty string", () => {
      expect(service["toNumber"]("")).toBeNull();
    });

    it("should return null for null/undefined", () => {
      expect(service["toNumber"](null)).toBeNull();
      expect(service["toNumber"](undefined)).toBeNull();
    });

    it("should parse numeric strings with commas as decimals", () => {
      expect(service["toNumber"]("1.234")).toBe(1.234);
      expect(service["toNumber"]("1,5")).toBe(1.5);
    });

    it("should return number as-is when input is number", () => {
      expect(service["toNumber"](42)).toBe(42);
    });

    it("should strip non-numeric characters except minus and dot", () => {
      expect(service["toNumber"]("$1.000")).toBe(1);
    });
  });

  describe("toCents (private, tested via reflection)", () => {
    it("should convert a dollar value to cents", () => {
      expect(service["toCents"](10)).toBe(1000);
    });

    it("should return null for null input", () => {
      expect(service["toCents"](null)).toBeNull();
    });

    it("should handle string input", () => {
      expect(service["toCents"]("25.50")).toBe(2550);
    });
  });

  describe("toMillimeters (private, tested via reflection)", () => {
    it("should default to centimeters (multiply by 10)", () => {
      expect(service["toMillimeters"]("5")).toBe(50);
    });

    it("should detect mm suffix", () => {
      expect(service["toMillimeters"]("100mm")).toBe(100);
    });

    it("should detect cm suffix", () => {
      expect(service["toMillimeters"]("5cm")).toBe(50);
    });

    it("should detect m suffix", () => {
      expect(service["toMillimeters"]("2m")).toBe(2000);
    });

    it("should return null for empty or invalid input", () => {
      expect(service["toMillimeters"]("")).toBeNull();
      expect(service["toMillimeters"](null)).toBeNull();
      expect(service["toMillimeters"]("abc")).toBeNull();
    });

    it("should handle numeric input", () => {
      expect(service["toMillimeters"](10)).toBe(100);
    });
  });

  describe("getRowFromCell (private, tested via reflection)", () => {
    it("should extract row number from cell reference", () => {
      expect(service["getRowFromCell"]("A1")).toBe(1);
      expect(service["getRowFromCell"]("B42")).toBe(42);
      expect(service["getRowFromCell"]("AA100")).toBe(100);
    });

    it("should return null when no digits present", () => {
      expect(service["getRowFromCell"]("ABC")).toBeNull();
    });
  });

  describe("mapWithConcurrency (private, tested via reflection)", () => {
    it("should process all items respecting concurrency limit", async () => {
      const items = [1, 2, 3, 4, 5];
      const worker = vi.fn().mockImplementation(async (item: number) => item * 2);

      const results = await service["mapWithConcurrency"](items, 2, worker);

      expect(results).toEqual([2, 4, 6, 8, 10]);
      expect(worker).toHaveBeenCalledTimes(5);
    });

    it("should return empty array for empty input", async () => {
      const results = await service["mapWithConcurrency"]([], 4, async x => x);

      expect(results).toEqual([]);
    });
  });
});
