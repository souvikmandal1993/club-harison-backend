import { Module } from '@nestjs/common';
import { TourPackagesService } from './tour-packages.service';
import { TourPackagesController } from './tour-packages.controller';

@Module({
  providers: [TourPackagesService],
  controllers: [TourPackagesController],
})
export class TourPackagesModule {}