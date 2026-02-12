import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { Get, Param, Res , Patch} from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from '../../common/services/pdf.service';

@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationsController {
  constructor(private service: QuotationsService) { }

  @Post('calculate')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  calculate(@Body() body: CreateQuotationDto) {
    return this.service.calculate(body);
  }

  @Get(':id/pdf')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  async downloadPdf(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const quotation = await this.service.findOne(+id);

    if (!quotation)
      throw new NotFoundException(
        'Quotation not found',
      );

    return PdfService.generateQuotationPdf(
      res,
      quotation,
    );
  }

  @Patch(':id/override')
  @Roles('SUPER_ADMIN')
  override(
    @Param('id') id: string,
    @Body() body: { overrideTotal: number },
  ) {
    return this.service.overrideTotal(
      +id,
      body.overrideTotal,
    );
  }
}