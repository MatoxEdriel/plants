import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PdfOptions, TableData } from './tableData.interface';


@Injectable()
export class PdfGeneratorServices {
  async generatePdf(options: PdfOptions): Promise<Buffer> {
    let html = '';

    if (options.table) {
      const headerBg = options.table.headerBgColor ?? '#007bff';
      const headerText = options.table.headerTextColor ?? '#fff';
      html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: ${headerBg}; color: ${headerText}; }
          </style>
        </head>
        <body>
          <h2>${options.title ?? 'Tabla de Datos'}</h2>
          <table>
            <thead>
              <tr>
                ${options.table.columns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${options.table.data.map(row => `
                <tr>
                  ${options.table!.columns.map(col => `<td>${row[col] ?? ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
      `;
    } else if (options.html) {
      html = options.html;
    } else {
      throw new Error('Debe proporcionar tabla o HTML para generar PDF.');
    }

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });

    await browser.close();
    return Buffer.from(pdf);
  }




}