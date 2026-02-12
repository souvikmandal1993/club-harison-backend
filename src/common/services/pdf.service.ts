import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

export class PdfService {
  static generateQuotationPdf(
    res: Response,
    quotation: any,
  ) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      'Content-Type',
      'application/pdf',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${quotation.quotationNumber}.pdf`,
    );

    doc.pipe(res);

    // HEADER
    doc
      .fontSize(20)
      .text('Club Harison Travels', {
        align: 'center',
      });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(
        `Quotation No: ${quotation.quotationNumber}`,
      );
    doc.text(
      `Travel Date: ${new Date(
        quotation.travelDate,
      ).toDateString()}`,
    );

    doc.moveDown();

    doc
      .fontSize(16)
      .text('Hotel Breakdown', {
        underline: true,
      });

    doc.moveDown();

    quotation.hotels.forEach((hotel: any, i: number) => {
      doc
        .fontSize(12)
        .text(
          `Location ${i + 1} - Nights: ${
            hotel.nights
          }`,
        );

      doc.text(
        `Rooms: ${hotel.numberOfRooms}`,
      );
      doc.text(
        `Price/Night: ₹${hotel.pricePerNight}`,
      );
      doc.text(
        `Extra/Room: ₹${hotel.customExtraPerRoom}`,
      );
      doc.text(
        `Total: ₹${hotel.total}`,
      );

      doc.moveDown();
    });

    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Hotel Total: ₹${quotation.hotelTotal}`);

    doc.text(`Vehicle: ₹${quotation.vehicleCost}`);
    doc.text(`Activity: ₹${quotation.activityCost}`);

    doc.moveDown();

    const totalToShow =
      quotation.overrideTotal || quotation.finalTotal;

    doc
      .fontSize(16)
      .text(
        `Final Total: ₹${totalToShow}`,
        { underline: true },
      );

    doc.end();
  }
}