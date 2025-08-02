import { Module } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthController } from "./admin-auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AdminAuthRepository } from "./admin-auth.repository";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminAuthRepository],
})
export class AdminAuthModule {}
