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
import { StatesService } from './states.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('states')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatesController {
  constructor(private statesService: StatesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() body: { name: string }) {
    return this.statesService.create(body.name);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findAll() {
    return this.statesService.findAll();
  }

  @Put(':id')
  @Roles('SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: { name: string },
  ) {
    return this.statesService.update(+id, body.name);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.statesService.delete(+id);
  }
}