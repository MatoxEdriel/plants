/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable } from '@nestjs/common';
import { Invoice } from '@novaCode/resource/generated/prisma/client';
import * as puppeteer from 'puppeteer';

@Injectable()
export class InvoicePdfService {
    async generatePdf(invoices: Invoice[]): Promise<Buffer> {
        const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Listado de Facturas</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>País</th>
                <th>Código Postal</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoices
                .map(
                    (inv) => `
                <tr>
                  <td>${inv.InvoiceId}</td>
                  <td>${inv.CustomerId}</td>
                  <td>${new Date(inv.InvoiceDate).toLocaleDateString()}</td>
                  <td>${inv.BillingAddress}</td>
                  <td>${inv.BillingCity}</td>
                  <td>${inv.BillingState}</td>
                  <td>${inv.BillingCountry}</td>
                  <td>${inv.BillingPostalCode}</td>
                  <td>${inv.Total}</td>
                </tr>
              // eslint-disable-next-line prettier/prettier, prettier/prettier
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfUint8 = await page.pdf({ format: 'A4', printBackground: true });
        const pdfBuffer = Buffer.from(pdfUint8); // convierte Uint8Array a Buffer
        return pdfBuffer;
    }
}