import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from "@nestjs/common";
import { MealsService } from "./meals.service";
import { CreateMealDto } from "./dto/create-meal.dto";
import { UpdateMealDto } from "./dto/update-meal.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Meals")
@ApiBearerAuth() // Agar token talab qilinmasa, bu qatorni olib tashlashingiz mumkin
@Controller("meals")
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi taom yaratish" })
  @ApiResponse({ status: 201, description: "Taom muvaffaqiyatli yaratildi" })
  @ApiResponse({ status: 400, description: "Noto‘g‘ri ma’lumotlar" })
  @ApiBody({ type: CreateMealDto })
  create(@Body() dto: CreateMealDto) {
    return this.mealsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha taomlarni olish" })
  @ApiResponse({ status: 200, description: "Taomlar ro‘yxati qaytarildi" })
  findAll() {
    return this.mealsService.findAll();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Taom ma’lumotini yangilash" })
  @ApiResponse({ status: 200, description: "Taom muvaffaqiyatli yangilandi" })
  @ApiResponse({ status: 404, description: "Taom topilmadi" })
  @ApiParam({ name: "id", type: Number, description: "Taom ID raqami" })
  @ApiBody({ type: UpdateMealDto })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto
  ) {
    return this.mealsService.update(id, updateMealDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Taomni o‘chirish" })
  @ApiResponse({ status: 200, description: "Taom muvaffaqiyatli o‘chirildi" })
  @ApiResponse({ status: 404, description: "Taom topilmadi" })
  @ApiParam({ name: "id", type: Number, description: "Taom ID raqami" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.mealsService.remove(id);
  }
}
