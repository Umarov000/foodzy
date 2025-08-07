import { IsInt, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class OrderItemDto {
  @ApiProperty({
    example: 1,
    description: "Buyurtma qilinayotgan taomning ID raqami",
  })
  @IsInt()
  mealId: number;

  @ApiProperty({ example: 2, description: "Buyurtma qilinayotgan taom soni" })
  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 5,
    description: "Buyurtma jo‘natiladigan manzilning ID raqami",
  })
  @IsInt()
  addressId: number;

  @ApiPropertyOptional({
    example: 3,
    description: "Agar mavjud bo‘lsa, promo yoki chegirma ID raqami",
  })
  @IsOptional()
  @IsInt()
  promoId?: number;

  @ApiProperty({
    type: [OrderItemDto],
    description: "Buyurtma qilinayotgan taomлар ro‘yxati",
    example: [
      { mealId: 1, quantity: 2 },
      { mealId: 4, quantity: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
