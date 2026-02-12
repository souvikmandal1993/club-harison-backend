import { Module } from '@nestjs/common';
import { HotelPricingService } from './hotel-pricing.service';
import { HotelPricingController } from './hotel-pricing.controller';

@Module({
  providers: [HotelPricingService],
  controllers: [HotelPricingController],
})
export class HotelPricingModule {}