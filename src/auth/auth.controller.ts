import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SigninUserDto } from "../users/dto/signin-user.dto";
import { Request, Response } from "express";
import { ResponseField } from "../common/types";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";
import { JwtAuth } from "../common/decorators";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(200)
  @Post("signin")
  signin(
    @Body() signinUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseField> {
    return this.authService.signin(signinUserDto, res);
  }

  @Get("activate/:link")
  async activate(@Param("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @HttpCode(200)
  @Post("logout")
  logout(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refreshToken, res);
  }

  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res);
  }
}
