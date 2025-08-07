import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Request } from "express";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Address")
@ApiBearerAuth()
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @Roles("USER")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @ApiOperation({ summary: "Yangi manzil qo‘shish" })
  @ApiResponse({ status: 201, description: "Manzil muvaffaqiyatli yaratildi." })
  @ApiResponse({ status: 401, description: "Ruxsat yo‘q (unauthorized)." })
  @ApiBody({ type: CreateAddressDto })
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.addressService.create(createAddressDto, userId);
  }

  @Patch(":id")
  @Roles("USER")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @ApiOperation({ summary: "Manzilni yangilash" })
  @ApiResponse({
    status: 200,
    description: "Manzil muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({ status: 404, description: "Manzil topilmadi." })
  @ApiParam({ name: "id", type: Number, description: "Manzil ID raqami" })
  @ApiBody({ type: UpdateAddressDto })
  update(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    const userId = (req as any).user.id;
    return this.addressService.update(userId, +id, updateAddressDto);
  }

  @Delete(":id")
  @Roles("USER")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @ApiOperation({ summary: "Manzilni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Manzil muvaffaqiyatli o‘chirildi.",
  })
  @ApiResponse({ status: 404, description: "Manzil topilmadi." })
  @ApiParam({ name: "id", type: Number, description: "Manzil ID raqami" })
  remove(@Req() req: Request, @Param("id") id: string) {
    const userId = (req as any).user.id;
    return this.addressService.remove(userId, +id);
  }
}
