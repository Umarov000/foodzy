import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus, PaymentStatus } from "@prisma/client";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async markOrderAsPaid(orderId: number, userId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.customerId !== userId) {
      throw new ForbiddenException("You are not allowed to pay for this order");
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new ForbiddenException("Order is already paid");
    }

    return this.prisma.orders.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
      },
    });
  }

  async simulatePayment(orderId: number, userId: number) {
    return this.markOrderAsPaid(orderId, userId);
  }
}
