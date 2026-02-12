import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { HotelPricingService } from './hotel-pricing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateHotelPricingDto } from './dto/create-hotel-pricing.dto';

@Controller('hotel-pricing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HotelPricingController {
  constructor(private service: HotelPricingService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() body: CreateHotelPricingDto) {
    return this.service.create(body);
  }

  @Get('hotel/:hotelId')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findByHotel(@Param('hotelId') hotelId: string) {
    return this.service.findByHotel(+hotelId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: { pricePerNight: number },
  ) {
    return this.service.update(+id, body.pricePerNight);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}