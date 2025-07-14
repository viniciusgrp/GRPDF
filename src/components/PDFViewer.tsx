'use client';

import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { usePDFWorker } from '@/hooks/usePDFWorker';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import { TextOverlay } from './TextOverlay';

interface PDFViewerProps {
  pdfUrl?: string;
}

export default function PDFViewer({ pdfUrl: propPdfUrl }: PDFViewerProps) {
  const { 
    pdfUrl: contextPdfUrl, 
    currentPage, 
    totalPages, 
    zoom, 
    goToPage,
    zoomIn,
    zoomOut 
  } = usePDFEditor();

  // Configurar worker do PDF.js
  usePDFWorker();

  // Usar URL do contexto se disponível, senão usar a prop
  const pdfUrl = contextPdfUrl || propPdfUrl;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    // Atualizar o total de páginas no contexto se necessário
    // PDF carregado com sucesso
  }

  const goToPrevPage = () => {
    goToPage(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    goToPage(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="p-2 rounded-md bg-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-black">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-md bg-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-md bg-gray-500 hover:bg-gray-200"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 rounded-md bg-gray-500 hover:bg-gray-200"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="p-4 overflow-auto max-h-screen">
        <div className="flex justify-center">
          {pdfUrl ? (
            <Document
              key={pdfUrl} // Força re-render quando a URL muda
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Carregando PDF...</span>
                </div>
              }
              error={
                <div className="text-red-600 p-4 text-center">
                  Erro ao carregar o PDF. Verifique se o arquivo é válido.
                </div>
              }
            >
              <div className="relative">
                <Page
                  pageNumber={currentPage}
                  scale={zoom}
                  className="shadow-lg"
                />
                <TextOverlay scale={zoom} pageNumber={currentPage} />
              </div>
            </Document>
          ) : (
            <div className="text-gray-500 p-8 text-center">
              Nenhum PDF carregado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
