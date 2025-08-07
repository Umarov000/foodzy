import { IsEmail, IsStrongPassword } from "class-validator";

export class SigninUserDto {
  @IsEmail()
  email: string;
  @IsStrongPassword(
    { minLength: 6, minSymbols: 0, minUppercase: 0 },
    { message: "Parol yetarlicha mustahkam emas" }
  )
  password: string;
}
