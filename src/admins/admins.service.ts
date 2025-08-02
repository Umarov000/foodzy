import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RoleValue } from "../../generated/prisma";

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAdminDto: CreateAdminDto) {
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
        role: RoleValue.ADMIN,
      },
    });
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
