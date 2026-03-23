import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { vi } from "vitest";

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    process.env.DEFINED_USERNAME = "admin";
    process.env.DEFINED_PASSWORD = "secret";
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { signAsync: vi.fn() },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  // Finding 12: wrong username should throw with generic message
  describe("signIn", () => {
    it("wrong username → should throw UnauthorizedException with generic message", async () => {
      await expect(authService.signIn("wronguser", "anypassword")).rejects.toThrow(
        new UnauthorizedException("Invalid credentials"),
      );
    });

    it("correct username, wrong password → should throw UnauthorizedException with same generic message", async () => {
      await expect(authService.signIn("admin", "wrongpassword")).rejects.toThrow(
        new UnauthorizedException("Invalid credentials"),
      );
    });
  });
});
