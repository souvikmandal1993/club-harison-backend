import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StatesModule } from './modules/states/states.module';
import { LocationsModule } from './modules/locations/locations.module';
import { TourPackagesModule } from './modules/tour-packages/tour-packages.module';
import { HotelCategoriesModule } from './modules/hotel-categories/hotel-categories.module';
import { MealPlansModule } from './modules/meal-plans/meal-plans.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { SeasonsModule } from './modules/seasons/seasons.module';
import { HotelPricingModule } from './modules/hotel-pricing/hotel-pricing.module';
import { QuotationsModule } from './modules/quotations/quotations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    StatesModule,
    LocationsModule,
    TourPackagesModule,
    HotelCategoriesModule,
    MealPlansModule,
    HotelsModule,
    SeasonsModule,
    HotelPricingModule,
    QuotationsModule
  ],
})
export class AppModule { }