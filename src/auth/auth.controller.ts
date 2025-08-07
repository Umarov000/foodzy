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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Avtorizatsiya")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin tomonidan foydalanuvchi ro'yxatdan o'tkazish",
  })
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi",
  })
  @Roles("ADMIN", "SUPERADMIN")
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuardJwt)
  @Post("register")
  register(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.authService.register(createUserDto, req);
  }

  @ApiOperation({ summary: "Foydalanuvchi tomonidan ro'yxatdan o'tish" })
  @ApiResponse({
    status: 201,
    description: "Ro'yxatdan o'tish muvaffaqiyatli bajarildi",
  })
  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @ApiOperation({ summary: "Foydalanuvchi tizimga kirishi (login)" })
  @ApiResponse({ status: 200, description: "Login muvaffaqiyatli bajarildi" })
  @HttpCode(200)
  @Post("signin")
  signin(
    @Body() signinUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseField> {
    return this.authService.signin(signinUserDto, res);
  }

  @ApiOperation({
    summary: "Emailni tasdiqlash havolasi orqali faollashtirish",
  })
  @Get("activate/:link")
  async activate(@Param("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Foydalanuvchini tizimdan chiqishi (logout)" })
  @HttpCode(200)
  @UseGuards(AuthGuardJwt)
  @Post("logout")
  logout(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refreshToken, res);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Tokenni yangilash (refresh)" })
  @HttpCode(200)
  @UseGuards(AuthGuardJwt)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Joriy foydalanuvchi ma'lumotlarini olish" })
  @UseGuards(AuthGuardJwt)
  @Get("profile")
  me(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.authService.getMe(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Profilni tahrirlash" })
  @UseGuards(AuthGuardJwt)
  @Patch("profile")
  updateMe(@Body() updateMeDto: UpdateProfileDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.authService.updateMe(userId, updateMeDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Parolni unutgan foydalanuvchilar uchun reset so‘rovi",
  })
  @HttpCode(200)
  @UseGuards(AuthGuardJwt)
  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Yangi parol o‘rnatish" })
  @HttpCode(200)
  @UseGuards(AuthGuardJwt)
  @Post("reset-password")
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user.id;
    return this.authService.resetPassword(userId, resetPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Tasdiqlovchi kod orqali parolni tiklash" })
  @HttpCode(200)
  @UseGuards(AuthGuardJwt)
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
