import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRestaurantDto {
  @ApiProperty({
    example: "Burger King",
    description: "Restoran nomi",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "https://example.com/image.jpg",
    description: "Restoran rasmi uchun URL",
  })
  @IsString()
  image: string;

  @ApiProperty({
    example: "Tez tayyorlanadigan taomlar tarmogʻi",
    description: "Restoran haqida qisqacha maʼlumot",
  })
  @IsString()
  description: string;
}
