import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { MailService } from "../mail/mail.service";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { Users } from "../../generated/prisma";
import { MessageType, ResponseField, Tokens } from "../common/types";
import { SigninUserDto } from "../users/dto/signin-user.dto";
import { AuthRepository } from "./auth.repository";
import { UtilsService } from "../common/utils/utils.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly authRepository: AuthRepository,
    private readonly utilsService: UtilsService
  ) {}
  private async generateUsersTokens(user: Users): Promise<Tokens> {
    const payload = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      isPremium: user.isPremium,
      role: user.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async signup(createUserDto: CreateUserDto): Promise<MessageType> {
    const candidate = await this.authRepository.findUserByEmail(
      createUserDto.email
    );
    if (candidate) {
      throw new ConflictException("User already exists");
    }
    const newUser = await this.authRepository.createUser(createUserDto);
    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException(`While sending email error`);
    }
    return { message: `Royxatdan otdingiz , Akkauntni tasdiqlang` };
  }

  async signin(
    signinUserDto: SigninUserDto,
    res: Response
  ): Promise<ResponseField> {
    const user = await this.authRepository.findUserByEmail(signinUserDto.email);
    if (!user) {
      throw new UnauthorizedException("Password or Email incorrect");
    }
    console.log(typeof user.id);
    if (!user.isActive) {
      throw new UnauthorizedException(
        "You have not verified your account, Please verify your account"
      );
    }
    const validPassword = await bcrypt.compare(
      signinUserDto.password,
      user.password
    );

    if (!validPassword) {
      throw new UnauthorizedException("Password or Email incorrect");
    }
    const { accessToken, refreshToken } = await this.generateUsersTokens(user);

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 7),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return {
      message: "You signed in successfully",
      accessToken,
    };
  }
  async logout(refreshToken: string, res: Response): Promise<MessageType> {
    let userData: any;
    try {
      userData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }

    if (!userData) {
      throw new ForbiddenException("User not found");
    }
    await this.authRepository.updateRefreshToken(userData.id, "");

    res.clearCookie("refreshToken");
    return { message: "Logged out" };
  }
  async refresh(req: Request, res: Response) {
    const token = req.cookies["refreshToken"];
    if (!token) {
      throw new UnauthorizedException("Please sign in first");
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.prisma.users.findUnique({
      where: { id: payload.id },
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException("User not found or not signed in");
    }

    const isTokenValid = await bcrypt.compare(token, user.refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException("Refresh token does not match");
    }

    const { accessToken, refreshToken } = await this.generateUsersTokens(user);

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 7),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME!,
    });

    return {
      message: "Tokens refreshed successfully",
      accessToken,
    };
  }
  async activate(activationLink: string) {
    const user = await this.authRepository.findByActivationLink(activationLink);
    if (!user) {
      throw new UnauthorizedException("Activation link is invalid");
    }

    if (user.isActive) {
      return { message: "Account is already activated" };
    }

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        isActive: true,
      },
    });

    return { message: "Your account has been successfully activated" };
  }

  //   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
  //     const user = await this.prisma.user.findUnique({
  //       where: { email: forgotPasswordDto.email },
  //     });

  //     if (!user) {
  //       throw new NotFoundException("User with this email not found");
  //     }

  //     const otp = otpGenerator.generate(8, {
  //       upperCaseAlphabets: false,
  //       lowerCaseAlphabets: false,
  //       specialChars: false,
  //     });

  //     await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: { password_token: otp },
  //     });

  //     await this.mailService.sendResetPasswordEmail(user.email, otp);

  //     return { message: "Reset password OTP sent to your email" };
  //   }
  //   async resetPassword(userId: number, resetPasswordDto: ResetPasswordDto) {
  //     const { oldPassword, newPassword, confirmPassword } = resetPasswordDto;
  //     if (oldPassword === newPassword) {
  //       throw new BadRequestException(
  //         "New password must be different from the old password"
  //       );
  //     }

  //     if (newPassword !== confirmPassword) {
  //       throw new BadRequestException("New passwords do not match");
  //     }
  //     const user = await this.prisma.user.findUnique({ where: { id: userId } });

  //     if (!user) {
  //       throw new NotFoundException("User not found");
  //     }
  //     const isOldPasswordCorrect = await bcrypt.compare(
  //       oldPassword,
  //       user.password
  //     );
  //     if (!isOldPasswordCorrect) {
  //       throw new BadRequestException("Old password is incorrect");
  //     }
  //     const hashedNewPassword = await bcrypt.hash(newPassword, 7);

  //     await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         password: hashedNewPassword,
  //       },
  //     });

  //     return { message: "Password updated successfully" };
  //   }
  //   async resetForgotPassword(
  //     otp_code: string,
  //     password: string,
  //     confirmPassword: string
  //   ) {
  //     const user = await this.prisma.user.findFirst({
  //       where: { password_token: otp_code },
  //     });

  //     if (!user) {
  //       throw new NotFoundException("User not found");
  //     }
  //     console.log(`User`, user);
  //     console.log(`Password:`, user.password);

  //     if (password !== confirmPassword) {
  //       throw new BadRequestException("Passwords do not match");
  //     }

  //     const isSame = await bcrypt.compare(password, user.password);
  //     if (isSame) {
  //       throw new BadRequestException(
  //         "New password must be different from the old one"
  //       );
  //     }

  //     const hashpassword = await bcrypt.hash(password, 10);

  //     user.password = hashpassword;

  //     const user1 = await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         password: hashpassword,
  //         password_token: null,
  //       },
  //     });
  //     console.log(user1);

  //     return { message: "Password reset successfully" };
  //   }

  //   async getMe(userId: number) {
  //     const user = await this.prisma.user.findUnique({
  //       where: { id: userId },
  //       select: {
  //         fullName: true,
  //         email: true,
  //       },
  //     });

  //     if (!user) {
  //       throw new NotFoundException("Foydalanuvchi topilmadi");
  //     }

  //     return user;
  //   }

  //   async updateMe(userId: number, updateMeDto: UpdateMeDto) {
  //     const user = await this.prisma.user.findUnique({ where: { id: userId } });

  //     if (!user) {
  //       throw new NotFoundException("User not found");
  //     }

  //     const updatedUser = await this.prisma.user.update({
  //       where: { id: userId },
  //       data: updateMeDto,
  //     });

  //     return {
  //       message: "Profile updated successfully",
  //       user: {
  //         fullName: updatedUser.fullName,
  //         email: updatedUser.email,
  //       },
  //     };
  //   }
}
