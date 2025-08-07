import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CourierService } from "./courier.service";
import { Request } from "express";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Courier")
@ApiBearerAuth()
@Controller("courier")
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @UseGuards(AuthGuardJwt)
  @Get("orders")
  @ApiOperation({ summary: "Kuryerga biriktirilgan buyurtmalarni olish" })
  @ApiResponse({
    status: 200,
    description: "Kuryerga tegishli buyurtmalar ro‘yxati qaytarildi",
  })
  @ApiResponse({ status: 401, description: "Ruxsatsiz (unauthorized)" })
  getAssignedOrders(@Req() req: Request) {
    const courierId = (req as any).user.id;
    return this.courierService.getAssignedOrders(courierId);
  }

  @UseGuards(AuthGuardJwt)
  @Post("orders/:id/deliver")
  @ApiOperation({ summary: "Buyurtmani yetkazilgan deb belgilash" })
  @ApiResponse({
    status: 200,
    description: "Buyurtma yetkazilgan deb belgilandi",
  })
  @ApiResponse({ status: 401, description: "Ruxsatsiz (unauthorized)" })
  @ApiResponse({ status: 404, description: "Buyurtma topilmadi" })
  @ApiParam({ name: "id", type: Number, description: "Buyurtma ID raqami" })
  async deliverOrder(
    @Param("id", ParseIntPipe) orderId: number,
    @Req() req: Request
  ) {
    const courierId = (req as any).user.id;
    return this.courierService.markOrderAsDelivered(orderId, courierId);
  }

  @UseGuards(AuthGuardJwt)
  @Get("stats")
  @ApiOperation({ summary: "Kuryer statistikasi" })
  @ApiResponse({
    status: 200,
    description: "Kuryer statistikasi muvaffaqiyatli qaytarildi",
  })
  @ApiResponse({ status: 401, description: "Ruxsatsiz (unauthorized)" })
  async getStats(@Req() req: Request) {
    const courierId = (req as any).user.id;
    return this.courierService.getCourierStats(courierId);
  }
}
