import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuotationsService {
  constructor(private prisma: PrismaService) { }

  // -----------------------------------------
  // CALCULATE ONLY (no save)
  // -----------------------------------------
  async calculate(data: any) {
    const tourPackage =
      await this.prisma.tourPackage.findUnique({
        where: { id: data.tourPackageId },
        include: { locations: true },
      });

    if (!tourPackage)
      throw new NotFoundException('Tour package not found');

    let hotelTotal = 0;
    const hotelBreakdown: any[] = [];

    for (const selection of data.hotels) {
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

      const total =
        perNight * nights * rooms;

      hotelTotal += total;

      hotelBreakdown.push({
        ...selection,
        nights,
        pricePerNight: perNight,
        total,
      });
    }

    const vehicleCost = 10000;
    const activityCost = 5000;

    const finalTotal =
      hotelTotal + vehicleCost + activityCost;

    return {
      hotelTotal,
      vehicleCost,
      activityCost,
      finalTotal,
      hotels: hotelBreakdown,
    };
  }

  // -----------------------------------------
  // GENERATE & SAVE
  // -----------------------------------------
  async generate(data: any, userId: number) {
    const calculation =
      await this.calculate(data);

    const quotationNumber = `Q-${Date.now()}`;

    return this.prisma.quotation.create({
      data: {
        quotationNumber,
        tourPackageId: data.tourPackageId,
        createdById: userId,
        travelDate: new Date(data.travelDate),
        hotelTotal: calculation.hotelTotal,
        vehicleCost: calculation.vehicleCost,
        activityCost: calculation.activityCost,
        finalTotal: calculation.finalTotal,
        baseTotal: calculation.finalTotal,
        profitAmount: 0,
        gstAmount: 0,
        hotels: {
          create: calculation.hotels.map((h) => ({
            hotelId: h.hotelId,
            tourPackageLocationId: h.tourPackageLocationId,
            seasonId: h.seasonId,
            mealPlanId: h.mealPlanId,
            numberOfRooms: h.numberOfRooms,
            customExtraPerRoom:
              h.customExtraPerRoom || 0,
            nights: h.nights,
            pricePerNight: h.pricePerNight,
            total: h.total,
          })),
        },
      },
      include: { hotels: true },
    });
  }

  // -----------------------------------------
  // GET ALL
  // -----------------------------------------
  async findAll() {
    return this.prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // -----------------------------------------
  // GET ONE
  // -----------------------------------------
  async findOne(id: number) {
    return this.prisma.quotation.findUnique({
      where: { id },
      include: { hotels: true },
    });
  }

  // -----------------------------------------
  // OVERRIDE TOTAL
  // -----------------------------------------
  async overrideTotal(
    id: number,
    overrideTotal: number,
  ) {
    return this.prisma.quotation.update({
      where: { id },
      data: { overrideTotal },
    });
  }
}
