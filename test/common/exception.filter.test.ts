import { vi } from "vitest";
import { AllExceptionsFilter } from "src/common/filters/exception.filter";
import { HttpAdapterHost } from "@nestjs/core";

describe("AllExceptionsFilter", () => {
  describe("catch", () => {
    it("should NOT expose a stack trace in the response body", () => {
      const mockReply = vi.fn();
      const mockGetRequestUrl = vi.fn().mockReturnValue("/test");

      const mockHttpAdapterHost = {
        httpAdapter: {
          getRequestUrl: mockGetRequestUrl,
          reply: mockReply,
        },
      } as unknown as HttpAdapterHost;

      const filter = new AllExceptionsFilter(mockHttpAdapterHost);

      const mockArgumentsHost = {
        switchToHttp: () => ({
          getRequest: vi.fn().mockReturnValue({}),
          getResponse: vi.fn().mockReturnValue({}),
        }),
      } as any;

      filter.catch(new Error("test error"), mockArgumentsHost);

      expect(mockReply).toHaveBeenCalledOnce();

      const responseBody = mockReply.mock.calls[0][1];

      expect(responseBody.stack).toBeUndefined();
    });
  });
});
