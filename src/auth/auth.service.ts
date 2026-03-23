import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(username: string, password: string) {
    if (
      username !== process.env.DEFINED_USERNAME ||
      password !== process.env.DEFINED_PASSWORD
    ) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: 1, username: username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
