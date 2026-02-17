import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { TourPackagesService } from './tour-packages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';

@Controller('tour-packages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TourPackagesController {
  constructor(private service: TourPackagesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() body: CreateTourPackageDto) {
    return this.service.create(body);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

  @Get('state/:stateId')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findByState(@Param('stateId') stateId: string) {
    return this.service.findByState(+stateId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}