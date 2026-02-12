import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@clubharison.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('Super Admin Created');
}

main().finally(() => prisma.$disconnect());