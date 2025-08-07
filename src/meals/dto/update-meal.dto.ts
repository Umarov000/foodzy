import { PartialType } from "@nestjs/mapped-types";
import { CreateMealDto } from "./create-meal.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class UpdateMealDto extends PartialType(CreateMealDto) {
  @ApiPropertyOptional({
    example: "Pepperoni Pizza",
    description: "Yangi taom nomi",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "Pishloqli va achchiq kolbasali",
    description: "Yangi taom tavsifi",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 60000, description: "Yangi narx (so‘m)" })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: "https://example.com/images/pepperoni-new.jpg",
    description: "Yangi rasm URL",
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 2, description: "Yangi restoran ID" })
  @IsOptional()
  @IsNumber()
  restaurantId?: number;

  @ApiPropertyOptional({ example: false, description: "Mavjudlik holati" })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
