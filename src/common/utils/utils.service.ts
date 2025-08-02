import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
  generateBcrypt = async (password: string) => {
    return bcrypt.hash(password, 7);
  };

  compareHash = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compareSync(password, hash);
  };
}
