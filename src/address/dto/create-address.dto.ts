import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAddressDto {
  @ApiProperty({
    example: "Uy",
    description: "Manzilning номи (masalan: Uy, Ishxona, Boshqa)",
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  title: string;

  @ApiProperty({
    example: "Toshkent shahri, Yunusobod tumani, Amir Temur ko‘chasi 15-uy",
    description: "Тўлиқ манзил маълумоти",
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 255)
  fullAddress: string;
}
