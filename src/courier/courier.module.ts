import { Module } from "@nestjs/common";
import { CourierService } from "./courier.service";
import { CourierController } from "./courier.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CourierController],
  providers: [CourierService],
})
export class CourierModule {}
