import { PartialType } from "@nestjs/mapped-types";
import { CreateAddressDto } from "./create-address.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiPropertyOptional({
    example: "Ishxona",
    description: "Yangi nom, agar o‘zgartirilsa",
  })
  title?: string;

  @ApiPropertyOptional({
    example: "Toshkent shahri, Chilonzor tumani, 10-kvartal, 45-uy",
    description: "Yangi to‘liq manzil, agar o‘zgartirilsa",
  })
  fullAddress?: string;
}
