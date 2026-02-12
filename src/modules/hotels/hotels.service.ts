import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(locationId: number, categoryId: number, name: string) {
    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) throw new NotFoundException('Location not found');

    const category = await this.prisma.hotelCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.hotel.create({
      data: {
        name,
        locationId,
        categoryId,
      },
    });
  }

  async findAll() {
    return this.prisma.hotel.findMany({
      include: {
        location: true,
        category: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByLocation(locationId: number) {
    return this.prisma.hotel.findMany({
      where: { locationId },
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async delete(id: number) {
    return this.prisma.hotel.delete({
      where: { id },
    });
  }
}