import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { PrismaService } from "../prisma/prisma.service";
import { MessageType } from "../common/types";

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAddressDto: CreateAddressDto, userId: number) {
    return await this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });
  }

  async update(
    userId: number,
    addressId: number,
    updateAddressDto: UpdateAddressDto
  ): Promise<MessageType> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException(`Address not found or not belongs to user`);
    }

    await this.prisma.address.update({
      where: { id: addressId },
      data: updateAddressDto,
    });
    return { message: "Your address updated successfully" };
  }

  async remove(userId: number, addressId: number): Promise<MessageType> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException(`Address not found or not belongs to user`);
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });
    return { message: "Your address deleted successfully" };
  }
}
