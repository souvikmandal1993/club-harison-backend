import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { HotelCategoriesService } from './hotel-categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('hotel-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HotelCategoriesController {
  constructor(private service: HotelCategoriesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() body: { name: string }) {
    return this.service.create(body.name);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}