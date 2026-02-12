import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationsController {
  constructor(private service: QuotationsService) {}

  @Post('calculate')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  calculate(@Body() body: CreateQuotationDto) {
    return this.service.calculate(body);
  }
}