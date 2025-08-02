import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminsModule,
    AdminAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
