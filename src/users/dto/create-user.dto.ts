import { RoleValue } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "Abdulbosit Umarov", description: "To‘liq ism" })
  @IsString()
  @IsNotEmpty({ message: "Ism-familya majburiy" })
  fullName: string;

  @ApiProperty({ example: "user@example.com", description: "Email manzili" })
  @IsEmail({}, { message: "Noto‘g‘ri email format" })
  email: string;

  @ApiPropertyOptional({
    example: "+998901234567",
    description: "Telefon raqam",
  })
  @IsOptional()
  @IsPhoneNumber("UZ", { message: "Telefon raqam noto‘g‘ri" })
  phone?: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Parol (kamida 6 ta belgidan iborat)",
  })
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak" })
  password: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Parolni tasdiqlash",
  })
  @IsString()
  confirmPassword: string;

  @ApiPropertyOptional({
    enum: RoleValue,
    example: RoleValue.USER,
    description: "Foydalanuvchi roli",
  })
  @IsOptional()
  @IsEnum(RoleValue, { message: "Noto‘g‘ri role qiymati" })
  role?: RoleValue;
}
