// decorators/jwt-auth.decorator.ts
import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuardJwt } from "../guards/jwt-auth.guard";

export function JwtAuth() {
  return applyDecorators(UseGuards(AuthGuardJwt));
}
