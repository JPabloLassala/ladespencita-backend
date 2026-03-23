import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { SheetController } from "src/modules/sheet/sheet.controller";
import { SheetService } from "src/modules/sheet/sheet.service";

const moduleMocker = new ModuleMocker(global);

describe("SheetController", () => {
  let controller: SheetController;
  let serviceMock: {
    parseExcel: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    serviceMock = {
      parseExcel: vi.fn().mockResolvedValue({ created: 2, productos: [] }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [SheetController],
    })
      .useMocker(token => {
        if (token === SheetService) {
          return serviceMock;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(SheetController);
  });

  describe("parseExcel", () => {
    it("should delegate to sheetService.parseExcel and return the result", async () => {
      const file = {
        buffer: Buffer.from("fake-xls"),
        originalname: "test.ods",
      } as Express.Multer.File;

      const result = await controller.parseExcel(file);

      expect(serviceMock.parseExcel).toHaveBeenCalledWith(file);
      expect(result).toEqual({ created: 2, productos: [] });
    });
  });
});
