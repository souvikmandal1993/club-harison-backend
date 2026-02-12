import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HotelPricingService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    hotelId: number;
    seasonId: number;
    mealPlanId: number;
    pricePerNight: number;
  }) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: data.hotelId },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    const season = await this.prisma.season.findUnique({
      where: { id: data.seasonId },
    });
    if (!season) throw new NotFoundException('Season not found');

    const mealPlan = await this.prisma.mealPlan.findUnique({
      where: { id: data.mealPlanId },
    });
    if (!mealPlan)
      throw new NotFoundException('Meal plan not found');

    try {
      return await this.prisma.hotelPricing.create({
        data: {
          hotelId: data.hotelId,
          seasonId: data.seasonId,
          mealPlanId: data.mealPlanId,
          pricePerNight: data.pricePerNight,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Pricing already exists for this combination',
      );
    }
  }

  async findByHotel(hotelId: number) {
    return this.prisma.hotelPricing.findMany({
      where: { hotelId },
      include: {
        season: true,
        mealPlan: true,
      },
    });
  }

  async update(id: number, pricePerNight: number) {
    return this.prisma.hotelPricing.update({
      where: { id },
      data: { pricePerNight },
    });
  }

  async delete(id: number) {
    return this.prisma.hotelPricing.delete({
      where: { id },
    });
  }
}