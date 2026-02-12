import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HotelCategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(name: string) {
        return this.prisma.hotelCategory.create({
            data: { name },
        });
    }

    async findAll() {
        return this.prisma.hotelCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async delete(id: number) {
        return this.prisma.hotelCategory.delete({
            where: { id },
        });
    }
}