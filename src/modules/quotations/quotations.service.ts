import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuotationsService {
  constructor(private prisma: PrismaService) { }

  async calculate(data: any) {
    const tourPackage = await this.prisma.tourPackage.findUnique({
      where: { id: data.tourPackageId },
      include: {
        locations: true,
      },
    });

    if (!tourPackage)
      throw new NotFoundException('Tour package not found');

    let hotelTotal = 0;

    console.log('Package Locations:', tourPackage.locations);

    for (const selection of data.hotels) {
      console.log("ss->", selection)
      const packageLocation =
        tourPackage.locations.find(
          (l) =>
            l.id === selection.tourPackageLocationId,
        );

      if (!packageLocation)
        throw new BadRequestException(
          'Invalid tourPackageLocationId',
        );

      const pricing =
        await this.prisma.hotelPricing.findUnique({
          where: {
            hotelId_seasonId_mealPlanId: {
              hotelId: selection.hotelId,
              seasonId: selection.seasonId,
              mealPlanId: selection.mealPlanId,
            },
          },
        });

      if (!pricing)
        throw new NotFoundException(
          'Pricing not configured',
        );

      const nights = packageLocation.numberOfNights;
      const rooms = selection.numberOfRooms;
      const extra = selection.customExtraPerRoom || 0;

      const perNight =
        Number(pricing.pricePerNight) + extra;

      hotelTotal += perNight * nights * rooms;
    }

    // Hardcoded for now
    const vehicleCost = 10000;
    const activityCost = 5000;

    const finalTotal =
      hotelTotal + vehicleCost + activityCost;

    return {
      hotelTotal,
      vehicleCost,
      activityCost,
      finalTotal,
    };
  }

  async findOne(id: number) {
    return this.prisma.quotation.findUnique({
      where: { id },
      include: {
        hotels: true,
      },
    });
  }

  async overrideTotal(
    quotationId: number,
    newTotal: number,
  ) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    return this.prisma.quotation.update({
      where: { id: quotationId },
      data: {
        overrideTotal: newTotal,
      },
    });
  }
}