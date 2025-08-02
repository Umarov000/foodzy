import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRefreshToken, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) {
      throw new ForbiddenException("Invalid Token");
    }
    if (!data) {
      return user;
    }
    console.log(`object`, user[data]);

    return user[data];
  }
);
