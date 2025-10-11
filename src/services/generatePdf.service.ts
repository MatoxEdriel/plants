import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { TableData } from './tableData.interface';


@Injectable()
export class PdfGeneratorServices {
  async generatePdfFromTable(table: TableData): Promise<Buffer> {
    const headerBg = table.headerBgColor ?? '#f5f5f5';
    const headerText = table.headerTextColor ?? '#000000';
    const html = `
      <html>
        <head>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: sans-serif; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: ${headerBg}; color: ${headerText}}
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${table.columns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${table.data.map(row => `
                <tr>
                  ${table.columns.map(col => `<td>${row[col] ?? ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    return this.generatePdfFromHtml(html);
  }




  async generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

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