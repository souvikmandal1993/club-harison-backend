import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MealPlansService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.mealPlan.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.mealPlan.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async delete(id: number) {
    return this.prisma.mealPlan.delete({
      where: { id },
    });
  }
}