import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const { addressId, items, promoId } = dto;

    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });
    if (!address) throw new NotFoundException("Address not found");

    const meals = await this.prisma.meal.findMany({
      where: {
        id: { in: items.map((item) => item.mealId) },
      },
    });

    if (meals.length !== items.length) {
      throw new NotFoundException("One or more meals not found");
    }

    let total = 0;

    items.forEach((item) => {
      const meal = meals.find((m) => m.id === item.mealId);
      if (!meal)
        throw new NotFoundException(`Meal with ID ${item.mealId} not found`);
      total += meal.price.toNumber() * item.quantity;
    });

    const order = await this.prisma.orders.create({
      data: {
        customerId: userId,
        addressId,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: PaymentMethod.CASH,
        total,
        items: {
          create: items.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }
  async findAllByUser(userId: number) {
    const orders = await this.prisma.orders.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            meal: {
              select: {
                name: true,
                description: true,
                price: true,
                image: true,
              },
            },
          },
        },
        address: {
          select: {
            title: true,
            fullAddress: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        meal: item.meal,
      })),
      address: order.address,
    }));
  }

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException("Order not found");

    if (order.customerId !== userId) {
      throw new ForbiddenException("You are not allowed to cancel this order");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException("Only pending orders can be canceled");
    }

    return this.prisma.orders.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });
  }
  async updateOrderStatus(orderId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException("Order already delivered");
    }

    const statusFlow: OrderStatus[] = [
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.ON_THE_WAY,
      OrderStatus.DELIVERED,
    ];

    const currentIndex = statusFlow.indexOf(order.status);

    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      throw new BadRequestException("Invalid order status transition");
    }

    const nextStatus = statusFlow[currentIndex + 1];

    const updatedOrder = await this.prisma.orders.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });

    return updatedOrder;
  }

  async assignCourierToOrder(orderId: number, courierId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException("Order not found");

    if (order.status !== OrderStatus.PREPARING) {
      throw new BadRequestException("Only preparing orders can be assigned");
    }

    const courier = await this.prisma.users.findUnique({
      where: { id: courierId },
    });

    if (!courier || courier.role !== "COURIER") {
      throw new BadRequestException("Invalid courier");
    }

    return this.prisma.orders.update({
      where: { id: orderId },
      data: {
        courierId,
        status: OrderStatus.ON_THE_WAY,
      },
    });
  }
}
