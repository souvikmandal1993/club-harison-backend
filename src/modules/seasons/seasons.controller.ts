import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateSeasonsDto } from './dto/update-seasons.dto';

@Controller('seasons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeasonsController {
  constructor(private service: SeasonsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  getAll() {
    return this.service.getAll();
  }

  @Put()
  @Roles('SUPER_ADMIN')
  update(@Body() body: UpdateSeasonsDto) {
    return this.service.updateSeasons(body.seasons);
  }
}