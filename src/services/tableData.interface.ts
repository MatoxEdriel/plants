
export type TableData = {
    columns: string[];
    data: Record<string, any>[];
    headerBgColor?: string;
    headerTextColor?: string;
};


export interface PdfOptions {
  table?: TableData;       // Si se quiere generar tabla automáticamente
  html?: string;           // HTML completo (si ya tienes diseño)
  logoUrl?: string;        // Logo para encabezado
  footerUrl?: string;      // Imagen de footer
  title?: string;          // Título de la factura
}
