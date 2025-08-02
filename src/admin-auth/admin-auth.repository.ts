import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";

@Injectable()
export class AdminAuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createAdmin(createAdminDto: CreateAdminDto) {
    const { fullName, email, password, confirmPassword } = createAdminDto;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    return this.prisma.users.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        isActive: true,
      },
    });
  }
  async findAdminByEmail(email: string) {
    return this.prisma.admins.findUnique({ where: { email } });
  }
  async updateRefreshToken(id: number, refreshToken: string) {
    const updatedUser = await this.prisma.admins.update({
      where: { id },
      data: { refreshToken },
    });

    return updatedUser;
  }
}
