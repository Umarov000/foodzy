import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RoleValue, Users } from "@prisma/client";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    const { fullName, email, password, confirmPassword } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    return this.prisma.users.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: RoleValue.USER,
      },
    });
  }

  async createWithRole(createUserDto: CreateUserDto) {
    const { fullName, email, password, confirmPassword } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    return this.prisma.users.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: createUserDto.role,
        isActive: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }
  async updateRefreshToken(id: number, refreshToken: string) {
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: { refreshToken },
    });

    return updatedUser;
  }
  async findByActivationLink(link: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { activationLink: link },
    });
  }
}
