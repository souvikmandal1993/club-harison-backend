import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Controller('hotels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HotelsController {
  constructor(private service: HotelsService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() body: CreateHotelDto) {
    return this.service.create(
      body.locationId,
      body.categoryId,
      body.name,
    );
  }

  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findAll() {
    return this.service.findAll();
  }

  @Get('location/:locationId')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findByLocation(@Param('locationId') locationId: string) {
    return this.service.findByLocation(+locationId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}