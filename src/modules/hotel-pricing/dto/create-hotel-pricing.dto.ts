import { IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHotelPricingDto {
  @IsInt()
  @Type(() => Number)
  hotelId: number;

  @IsInt()
  @Type(() => Number)
  seasonId: number;

  @IsInt()
  @Type(() => Number)
  mealPlanId: number;

  @IsNumber()
  @Type(() => Number)
  pricePerNight: number;
}