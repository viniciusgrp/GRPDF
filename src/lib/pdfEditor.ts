import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export class PDFEditor {
  private document: PDFDocument | null = null;

  async loadPDF(arrayBuffer: ArrayBuffer): Promise<void> {
    this.document = await PDFDocument.load(arrayBuffer);
  }

  async createNewPDF(): Promise<void> {
    this.document = await PDFDocument.create();
  }

  async addTextToPage(
    pageIndex: number,
    text: string,
    x: number,
    y: number,
    options?: {
      fontSize?: number;
      color?: { r: number; g: number; b: number };
      font?: string;
    }
  ): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');

    const pages = this.document.getPages();
    if (pageIndex >= pages.length) throw new Error('Page index out of bounds');

    const page = pages[pageIndex];
    const font = await this.document.embedFont(StandardFonts.Helvetica);
    
    // Converter coordenadas de tela para PDF (inverter Y)
    const pageHeight = page.getHeight();
    const pdfY = pageHeight - y - (options?.fontSize || 12);
    
    page.drawText(text, {
      x,
      y: pdfY,
      size: options?.fontSize || 12,
      font,
      color: options?.color ? rgb(options.color.r, options.color.g, options.color.b) : rgb(0, 0, 0),
    });
  }

  async addImageToPage(
    pageIndex: number,
    imageBytes: ArrayBuffer,
    x: number,
    y: number,
    width: number,
    height: number,
    imageType: 'png' | 'jpg'
  ): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');

    const pages = this.document.getPages();
    if (pageIndex >= pages.length) throw new Error('Page index out of bounds');

    const page = pages[pageIndex];
    
    let image;
    if (imageType === 'png') {
      image = await this.document.embedPng(imageBytes);
    } else {
      image = await this.document.embedJpg(imageBytes);
    }

    page.drawImage(image, {
      x,
      y,
      width,
      height,
    });
  }

  async rotatePage(pageIndex: number, rotationDegrees: number): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');

    const pages = this.document.getPages();
    if (pageIndex >= pages.length) throw new Error('Page index out of bounds');

    const page = pages[pageIndex];
    page.setRotation(degrees(rotationDegrees));
  }

  async deletePage(pageIndex: number): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');

    const pages = this.document.getPages();
    if (pageIndex >= pages.length) throw new Error('Page index out of bounds');

    this.document.removePage(pageIndex);
  }

  async duplicatePage(pageIndex: number): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');

    const pages = this.document.getPages();
    if (pageIndex >= pages.length) throw new Error('Page index out of bounds');

    const [copiedPage] = await this.document.copyPages(this.document, [pageIndex]);
    this.document.insertPage(pageIndex + 1, copiedPage);
  }

  async mergePDFs(pdfBuffers: ArrayBuffer[]): Promise<ArrayBuffer> {
    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  }

  async extractPages(pageIndices: number[]): Promise<ArrayBuffer> {
    if (!this.document) throw new Error('No PDF document loaded');

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(this.document, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    return await newPdf.save();
  }

  async save(): Promise<ArrayBuffer> {
    if (!this.document) throw new Error('No PDF document loaded');
    return await this.document.save();
  }

  getPageCount(): number {
    if (!this.document) return 0;
    return this.document.getPageCount();
  }

  async removeText(pageIndex: number, x: number, y: number): Promise<void> {
    // PDF-lib não suporta remoção direta de texto
    // Esta é uma implementação alternativa que desenha um retângulo branco sobre o texto
    if (!this.document) throw new Error('No PDF document loaded');

    const pages = this.document.getPages();
    if (pageIndex >= pages.length) throw new Error('Page index out of bounds');

    const page = pages[pageIndex];
    
    // Desenhar um retângulo branco sobre a área do texto para "apagá-lo"
    page.drawRectangle({
      x: x - 5,
      y: y - 5,
      width: 200, // Largura estimada do texto
      height: 20, // Altura estimada do texto
      color: rgb(1, 1, 1), // Branco
    });
  }

  async mergePDF(additionalPdfBuffer: ArrayBuffer): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');

    // Carregar o PDF adicional
    const additionalPdf = await PDFDocument.load(additionalPdfBuffer);
    
    // Copiar todas as páginas do PDF adicional
    const pageCount = additionalPdf.getPageCount();
    const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
    const copiedPages = await this.document.copyPages(additionalPdf, pageIndices);
    
    // Adicionar as páginas copiadas ao documento atual
    copiedPages.forEach((page) => this.document!.addPage(page));
  }

  async reorderPages(newOrder: number[]): Promise<void> {
    if (!this.document) throw new Error('No PDF document loaded');
    
    const pages = this.document.getPages();
    
    // Validar se a nova ordem contém todos os índices válidos
    if (newOrder.length !== pages.length) {
      throw new Error('A nova ordem deve conter exatamente o mesmo número de páginas');
    }
    
    // Validar se todos os índices são válidos
    for (const index of newOrder) {
      if (index < 0 || index >= pages.length) {
        throw new Error(`Índice de página inválido: ${index}`);
      }
    }
    
    // Criar um novo documento com as páginas na nova ordem
    const newDocument = await PDFDocument.create();
    
    // Copiar as páginas na nova ordem
    for (const originalIndex of newOrder) {
      const copiedPages = await newDocument.copyPages(this.document, [originalIndex]);
      newDocument.addPage(copiedPages[0]);
    }
    
    // Substituir o documento atual pelo novo documento reordenado
    this.document = newDocument;
  }

  async addBlankPage(): Promise<boolean> {
    if (!this.document) return false;
    
    try {
      // Obter as dimensões da primeira página como referência
      const pages = this.document.getPages();
      
      if (pages.length === 0) {
        // Se não há páginas, criar uma página padrão A4
        this.document.addPage([595.28, 841.89]); // A4 em pontos
      } else {
        // Usar as dimensões da primeira página
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        this.document.addPage([width, height]);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar página em branco:', error);
      return false;
    }
  }

  getPDFUrl(): string | null {
    if (!this.document) return null;
    
    try {
      // Retornar o documento como URL para visualização
      // Nota: Esta função será usada para atualizar a visualização
      return 'updated'; // Placeholder - o contexto vai gerar nova URL
    } catch (error) {
      console.error('Erro ao obter URL do PDF:', error);
      return null;
    }
  }

  clearDocument(): void {
    this.document = null;
  }
}

export const pdfEditor = new PDFEditor();
