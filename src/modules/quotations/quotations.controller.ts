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
import { Get, Param, Res , Patch , Req} from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from '../../common/services/pdf.service';

@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationsController {
  constructor(private service: QuotationsService) {}

  // --------------------------------------
  // Generate & Save Quotation
  // --------------------------------------
  @Post()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  generate(@Body() body: CreateQuotationDto, @Req() req) {
    return this.service.generate(body, req.user.id);
  }

  // --------------------------------------
  // Get All Quotations
  // --------------------------------------
  @Get()
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findAll() {
    return this.service.findAll();
  }

  // --------------------------------------
  // Get One Quotation
  // --------------------------------------
  @Get(':id')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // --------------------------------------
  // Calculate Only (without saving)
  // --------------------------------------
  @Post('calculate')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  calculate(@Body() body: CreateQuotationDto) {
    return this.service.calculate(body);
  }

  // --------------------------------------
  // Download PDF
  // --------------------------------------
  @Get(':id/pdf')
  @Roles('SUPER_ADMIN', 'SALES_EXECUTIVE')
  async downloadPdf(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const quotation = await this.service.findOne(+id);

    if (!quotation)
      throw new NotFoundException('Quotation not found');

    return PdfService.generateQuotationPdf(res, quotation);
  }

  // --------------------------------------
  // Override Total
  // --------------------------------------
  @Patch(':id/override')
  @Roles('SUPER_ADMIN')
  override(
    @Param('id') id: string,
    @Body() body: { overrideTotal: number },
  ) {
    return this.service.overrideTotal(+id, body.overrideTotal);
  }
}