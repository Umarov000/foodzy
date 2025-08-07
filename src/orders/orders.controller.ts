import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";
import { Request } from "express";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Orders")
@ApiBearerAuth()
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuardJwt)
  @Post()
  @ApiOperation({ summary: "Buyurtma yaratish" })
  @ApiResponse({
    status: 201,
    description: "Buyurtma muvaffaqiyatli yaratildi",
  })
  @ApiResponse({ status: 400, description: "Noto‘g‘ri ma'lumotlar" })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.ordersService.create(userId, dto);
  }

  @UseGuards(AuthGuardJwt)
  @Get("history")
  @ApiOperation({ summary: "Foydalanuvchining buyurtmalar tarixini olish" })
  @ApiResponse({ status: 200, description: "Buyurtmalar ro‘yxati qaytarildi" })
  findAllByUser(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.ordersService.findAllByUser(userId);
  }

  @UseGuards(AuthGuardJwt)
  @Post(":id/cancel")
  @ApiOperation({ summary: "Buyurtmani bekor qilish" })
  @ApiResponse({ status: 200, description: "Buyurtma bekor qilindi" })
  @ApiResponse({ status: 404, description: "Buyurtma topilmadi" })
  @ApiParam({ name: "id", type: Number, description: "Buyurtma ID raqami" })
  cancelOrder(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.ordersService.cancelOrder(userId, id);
  }

  @Post(":id/change-status")
  @ApiOperation({
    summary: "Buyurtma statusini o‘zgartirish (admin yoki tizim uchun)",
  })
  @ApiResponse({
    status: 200,
    description: "Status muvaffaqiyatli o‘zgartirildi",
  })
  @ApiParam({ name: "id", type: Number, description: "Buyurtma ID raqami" })
  updateOrderStatus(@Param("id") id: number) {
    return this.ordersService.updateOrderStatus(id);
  }

  @Post(":id/assign-courier")
  @ApiOperation({ summary: "Buyurtmaga kuryer biriktirish (admin uchun)" })
  @ApiResponse({
    status: 200,
    description: "Kuryer muvaffaqiyatli biriktirildi",
  })
  @ApiParam({ name: "id", type: Number, description: "Buyurtma ID raqami" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        courierId: {
          type: "number",
          example: 7,
          description: "Biriktirilayotgan kuryerning ID raqami",
        },
      },
      required: ["courierId"],
    },
  })
  async assignCourier(
    @Param("id", ParseIntPipe) orderId: number,
    @Body("courierId") courierId: number
  ) {
    return this.ordersService.assignCourierToOrder(orderId, courierId);
  }
}
