import { IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMealDto {
  @ApiProperty({
    example: "Pepperoni Pizza",
    description: "Taom nomi",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Yumshoq pishloq va achchiq kolbasa bilan",
    description: "Taom tavsifi",
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 55000,
    description: "Taom narxi so‘mda (maksimal 2 xonali kasr bo‘lishi mumkin)",
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({
    example: "https://example.com/images/pepperoni.jpg",
    description: "Rasm URL manzili",
  })
  @IsString()
  image: string;

  @ApiProperty({
    example: 3,
    description: "Restoran ID raqami (taom shu restoranga tegishli)",
  })
  @IsNumber()
  restaurantId: number;

  @ApiPropertyOptional({
    example: true,
    description: "Agar berilsa, taom mavjudligi holati",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
