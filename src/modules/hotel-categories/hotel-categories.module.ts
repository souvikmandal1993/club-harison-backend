import { Module } from '@nestjs/common';
import { HotelCategoriesService } from './hotel-categories.service';
import { HotelCategoriesController } from './hotel-categories.controller';

@Module({
  providers: [HotelCategoriesService],
  controllers: [HotelCategoriesController],
})
export class HotelCategoriesModule {}