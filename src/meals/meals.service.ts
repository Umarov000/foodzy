import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMealDto } from "./dto/create-meal.dto";
import { UpdateMealDto } from "./dto/update-meal.dto";

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateMealDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException("Restaurant not found");

    const meal = await this.prisma.meal.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        restaurantId: dto.restaurantId,
        isAvailable: dto.isAvailable ?? true,
      },
    });

    return meal;
  }

  async findAll() {
    return this.prisma.meal.findMany({
      where: { isAvailable: true }, // Фақат мавжуд таомлар
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async update(id: number, updateMealDto: UpdateMealDto) {
    const meal = await this.prisma.meal.findUnique({ where: { id } });
    if (!meal) throw new NotFoundException("Meal not found");

    return this.prisma.meal.update({
      where: { id },
      data: updateMealDto,
    });
  }

  async remove(id: number) {
    const meal = await this.prisma.meal.findUnique({ where: { id } });
    if (!meal) throw new NotFoundException("Meal not found");

    return this.prisma.meal.delete({ where: { id } });
  }
}
