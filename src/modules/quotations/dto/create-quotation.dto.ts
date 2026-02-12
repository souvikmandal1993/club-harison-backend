import {
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class SelectedHotelDto {
  @IsInt()
  @Type(() => Number)
  tourPackageLocationId: number;

  @IsInt()
  @Type(() => Number)
  hotelId: number;

  @IsInt()
  @Type(() => Number)
  seasonId: number;

  @IsInt()
  @Type(() => Number)
  mealPlanId: number;

  @IsInt()
  @Type(() => Number)
  numberOfRooms: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customExtraPerRoom?: number;
}

export class CreateQuotationDto {
  @IsInt()
  @Type(() => Number)
  tourPackageId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedHotelDto)
  hotels: SelectedHotelDto[];
}