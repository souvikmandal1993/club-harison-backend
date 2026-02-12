import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(stateId: number, name: string) {
    // Check state exists
    const state = await this.prisma.state.findUnique({
      where: { id: stateId },
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    return this.prisma.location.create({
      data: {
        name,
        stateId,
      },
    });
  }

  async findAll() {
    return this.prisma.location.findMany({
      include: { state: true },
      orderBy: { name: 'asc' },
    });
  }

  async findByState(stateId: number) {
    return this.prisma.location.findMany({
      where: { stateId },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, name: string) {
    return this.prisma.location.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: number) {
    return this.prisma.location.delete({
      where: { id },
    });
  }
}