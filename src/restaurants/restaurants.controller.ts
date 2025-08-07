import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RestaurantsService } from "./restaurants.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";

@ApiTags("Restoranlar") // Swagger'da bu controller nomi sifatida ko‘rinadi
@Controller("restaurants")
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi restoran yaratish" })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha restoranlarni olish" })
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Restoranni yangilash" })
  @ApiParam({ name: "id", type: Number, description: "Restoran ID raqami" })
  update(
    @Param("id") id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Restoranni o‘chirish" })
  @ApiParam({ name: "id", type: Number, description: "Restoran ID raqami" })
  remove(@Param("id") id: string) {
    return this.restaurantsService.remove(+id);
  }
}
