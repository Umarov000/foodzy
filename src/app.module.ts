import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { OrdersModule } from './orders/orders.module';
import { MealsModule } from './meals/meals.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { PaymentModule } from './payment/payment.module';
import { CourierModule } from './courier/courier.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AddressModule,
    OrdersModule,
    MealsModule,
    RestaurantsModule,
    PaymentModule,
    CourierModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
