
export type TableData = {
    columns: string[];
    data: Record<string, any>[];
    headerBgColor?: string;
    headerTextColor?: string;
};


export interface PdfOptions {
  table?: TableData;       
  html?: string;           
  logoUrl?: string;        
  footerUrl?: string;     
  title?: string;        
}
