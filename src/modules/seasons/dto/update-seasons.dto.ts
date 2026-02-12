import {
  IsEnum,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SeasonType } from '@prisma/client';

export class SeasonUpdateItemDto {
  @IsEnum(SeasonType)
  name: SeasonType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class UpdateSeasonsDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => SeasonUpdateItemDto)
  seasons: SeasonUpdateItemDto[];
}