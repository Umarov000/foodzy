import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuardJwt } from "../common/guards/jwt-auth.guard";
import { Roles } from "../common/decorators";
import { RolesGuard } from "../common/guards/roles.guard";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles("ADMIN", "SUPERADMIN")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles("ADMIN", "SUPERADMIN")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }
  @Roles("ADMIN", "SUPERADMIN")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Delete(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @Roles("ADMIN", "SUPERADMIN")
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
