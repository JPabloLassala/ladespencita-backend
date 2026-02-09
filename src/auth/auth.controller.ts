import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: { username: string; password: string }) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
