import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { RoleValue } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.users.findUnique({
    where: { email: "superadmin@example.com" },
  });
  if (existing) {
    console.log("Superadmin already exists");
    return;
  }

  const password = await bcrypt.hash("Secure123!", 10);

  await prisma.users.create({
    data: {
      email: "superadmin@example.com",
      password,
      role: RoleValue.SUPERADMIN,
      fullName: "Super Admin",
      phone: "+998901234567",
      isActive: true,
      isPremium: true,
    },
  });

  console.log("✅ Superadmin created!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
