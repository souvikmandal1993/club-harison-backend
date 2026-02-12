import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @IsInt()
  @Type(() => Number)
  stateId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}