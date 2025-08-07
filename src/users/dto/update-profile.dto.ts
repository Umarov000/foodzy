import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName?: string;

  @IsEmail()
  email?: string;

  @IsNotEmpty()
  phone?: string;
}
