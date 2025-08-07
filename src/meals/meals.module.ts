import { Module } from "@nestjs/common";
import { MealsService } from "./meals.service";
import { MealsController } from "./meals.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
