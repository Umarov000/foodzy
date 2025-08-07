import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Request } from "express";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @UseGuards(AuthGuardJwt)
  @Post("simulate/:orderId")
  simulate(
    @Param("orderId", ParseIntPipe) orderId: number,
    @Req() req: Request
  ) {
    const userId = (req as any).user.id;

    return this.paymentService.simulatePayment(orderId, userId);
  }
}
