import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    return this.prisma.users.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.prisma.users.delete({
      where: { id },
    });
  }
}
