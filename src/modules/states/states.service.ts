

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatesService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.state.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.state.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, name: string) {
    return this.prisma.state.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: number) {
    return this.prisma.state.delete({
      where: { id },
    });
  }
}