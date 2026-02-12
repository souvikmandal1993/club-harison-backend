import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() body: CreateLocationDto) {
    return this.locationsService.create(body.stateId, body.name);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('state/:stateId')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findByState(@Param('stateId') stateId: string) {
    return this.locationsService.findByState(+stateId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: { name: string },
  ) {
    return this.locationsService.update(+id, body.name);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.locationsService.delete(+id);
  }
}