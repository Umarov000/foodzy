import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
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
import { UpdateProfileDto } from "../users/dto/update-profile.dto";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators";
import { ForgotPasswordDto } from "../users/dto/forgot-password.dto";
import { ResetPasswordDto } from "../users/dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles("ADMIN", "SUPERADMIN")
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuardJwt)
  @Post("register")
  register(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.authService.register(createUserDto, req);
  }

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

  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  @Post("logout")
  logout(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refreshToken, res);
  }

  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res);
  }

  @UseGuards(AuthGuardJwt)
  @Get("profile")
  me(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.authService.getMe(userId);
  }

  @UseGuards(AuthGuardJwt)
  @Patch("profile")
  updateMe(@Body() updateMeDto: UpdateProfileDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.authService.updateMe(userId, updateMeDto);
  }

  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  @Post("reset-password")
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user.id;
    return this.authService.resetPassword(userId, resetPasswordDto);
  }

  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  @Post("confirm-password")
  resetForgotPassword(
    @Body("otpCode") otpCode: string,
    @Body("newPassword") newPassword: string,
    @Body("confirmPassword") confirmPassword: string
  ) {
    return this.authService.resetForgotPassword(
      otpCode,
      newPassword,
      confirmPassword
    );
  }
}
