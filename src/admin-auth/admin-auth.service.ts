import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AdminAuthRepository } from "./admin-auth.repository";
import { MessageType, Tokens } from "../common/types";
import { Admins } from "../../generated/prisma";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly adminAuthRepository: AdminAuthRepository
  ) {}
  private async generateAdminsTokens(admin: Admins): Promise<Tokens> {
    const payload = {
      id: admin.id,
      email: admin.email,
      isActive: admin.isActive,
      isCreator: admin.isCreator,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY_ADMIN,
        expiresIn: process.env.ACCESS_TOKEN_TIME_ADMIN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
        expiresIn: process.env.REFRESH_TOKEN_TIME_ADMIN,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async register(createAdminDto: CreateAdminDto): Promise<MessageType> {
    const candidate = await this.adminAuthRepository.findAdminByEmail(
      createAdminDto.email
    );
    if (candidate) {
      throw new ConflictException("User already exists");
    }
    const newAdmin = await this.adminAuthRepository.createAdmin(createAdminDto);

    return { message: `Welcome ${newAdmin.fullName}` };
  }
}
