import { PrismaClient, Role, SeasonType } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Hash password
  const passwordHash = await bcrypt.hash('admin123', 10)

  // Create Super Admin
  await prisma.user.upsert({
    where: { email: 'admin@clubharison.com' },
    update: {
      name: 'Super Admin',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      name: 'Super Admin',
      email: 'admin@clubharison.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });


  // Create default seasons
  const seasons = [
    {
      name: SeasonType.PEAK,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
    },
    {
      name: SeasonType.MODERATE,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-06-30'),
    },
    {
      name: SeasonType.OFF,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-12-31'),
    },
  ];

  for (const season of seasons) {
    await prisma.season.upsert({
      where: { name: season.name },
      update: {
        startDate: season.startDate,
        endDate: season.endDate,
      },
      create: season,
    });
  }


  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
