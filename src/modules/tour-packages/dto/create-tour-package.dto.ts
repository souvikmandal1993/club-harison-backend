import {
  IsString,
  IsNotEmpty,
  IsInt,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class PackageLocationDto {
  @IsInt()
  @Type(() => Number)
  locationId: number;

  @IsInt()
  @Type(() => Number)
  numberOfNights: number;

  @IsInt()
  @Type(() => Number)
  sequenceOrder: number;
}

export class CreateTourPackageDto {
  @IsInt()
  @Type(() => Number)
  stateId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => PackageLocationDto)
  @ArrayMinSize(1)
  locations: PackageLocationDto[];
}