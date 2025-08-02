import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.setGlobalPrefix("api");

  const PORT = config.get<number>("PORT");
  await app.listen(PORT ?? 3003, () => {
    console.log(`Server started at: ${PORT}`);
  });
}
bootstrap();
