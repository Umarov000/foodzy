import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CourierService {
  constructor(private prisma: PrismaService) {}

  async getAssignedOrders(courierId: number) {
    const courier = await this.prisma.users.findUnique({
      where: { id: courierId },
    });

    if (!courier || courier.role !== "COURIER") {
      throw new ForbiddenException(
        "You are not authorized to view these orders"
      );
    }

    const orders = await this.prisma.orders.findMany({
      where: {
        courierId,
      },
      include: {
        customer: {
          select: {
            phone: true,
          },
        },
        items: {
          select: {
            quantity: true,
            meal: {
              select: {
                name: true,
                price: true,
                restaurant: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return orders;
  }

  async markOrderAsDelivered(orderId: number, courierId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.courierId !== courierId) {
      throw new ForbiddenException("You are not assigned to this order");
    }

    if (order.status !== "ON_THE_WAY") {
      throw new ForbiddenException(
        "Only orders that are on the way can be delivered"
      );
    }

    const commission = order.total.toNumber() * 0.1;

    await this.prisma.$transaction(async (tx) => {
      await tx.orders.update({
        where: { id: orderId },
        data: { status: "DELIVERED" },
      });

      const existingStats = await tx.courierStats.findUnique({
        where: { courierId },
      });

      if (existingStats) {
        await tx.courierStats.update({
          where: { courierId },
          data: {
            orders: { increment: 1 },
            earnings: { increment: commission },
          },
        });
      } else {
        await tx.courierStats.create({
          data: {
            courierId,
            orders: 1,
            earnings: commission,
          },
        });
      }
    });

    return { message: "Order marked as delivered" };
  }

  async getCourierStats(courierId: number) {
    const deliveredOrders = await this.prisma.orders.findMany({
      where: {
        courierId,
        status: "DELIVERED",
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const totalOrders = deliveredOrders.length;
    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.total) * 0.1,
      0
    );

    return {
      totalOrders,
      totalEarnings: +totalEarnings.toFixed(2),
    };
  }
}
