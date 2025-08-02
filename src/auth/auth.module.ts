import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../mail/mail.module";
import { AuthRepository } from "./auth.repository";
import { UtilsModule } from "../common/utils/utils.module";

@Module({
  imports: [PrismaModule, JwtModule, MailModule, UtilsModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
