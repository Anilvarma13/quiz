declare module "pdf2json" {
  interface TextRun {
    T: string
    S?: number
    TS?: number[]
  }
  interface Text {
    x: number
    y: number
    w?: number
    sw?: number
    A?: string
    R: TextRun[]
  }
  interface Page {
    Width: number
    Height: number
    HLines: any[]
    VLines: any[]
    Fills: any[]
    Texts: Text[]
    Fields: any[]
    Boxsets: any[]
  }
  interface PDFData {
    Transcoder?: string
    Pages: Page[]
    Width: number
  }
  interface ErrorData {
    parserError: Error | string
  }
  class PDFParser {
    constructor(context?: any, pdfReadableStream?: any)
    on(event: "pdfParser_dataReady", callback: (data: PDFData) => void): this
    on(event: "pdfParser_dataError", callback: (errData: ErrorData) => void): this
    parseBuffer(buffer: Buffer): void
    loadPDF(path: string, verbosity?: number): void
  }
  export = PDFParser
}
