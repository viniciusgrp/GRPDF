'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { X, ArrowUp, ArrowDown, RotateCw } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import { usePDFWorker } from '@/hooks/usePDFWorker';

interface PageReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PageInfo {
  pageNumber: number;
  originalIndex: number;
}

export function PageReorderModal({ isOpen, onClose }: PageReorderModalProps) {
  const { pdfUrl, totalPages, reorderPages, isLoading } = usePDFEditor();
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Configurar worker do PDF.js
  usePDFWorker();

  useEffect(() => {
    if (isOpen && totalPages > 0) {
      // Inicializar array de páginas com ordem original
      const initialPages: PageInfo[] = Array.from({ length: totalPages }, (_, i) => ({
        pageNumber: i + 1,
        originalIndex: i
      }));
      setPages(initialPages);
    }
  }, [isOpen, totalPages]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];
    
    // Remover da posição original
    newPages.splice(draggedIndex, 1);
    
    // Inserir na nova posição
    newPages.splice(dropIndex, 0, draggedPage);
    
    setPages(newPages);
    setDraggedIndex(null);
  };

  const movePageUp = (index: number) => {
    if (index === 0) return;
    
    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[index - 1];
    newPages[index - 1] = temp;
    
    setPages(newPages);
  };

  const movePageDown = (index: number) => {
    if (index === pages.length - 1) return;
    
    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[index + 1];
    newPages[index + 1] = temp;
    
    setPages(newPages);
  };

  const handleSaveOrder = async () => {
    try {
      // Extrair apenas os índices originais na nova ordem
      const newOrder = pages.map(page => page.originalIndex);
      await reorderPages(newOrder);
      onClose();
    } catch (error) {
      console.error('Erro ao reordenar páginas:', error);
    }
  };

  const hasChanges = () => {
    return pages.some((page, index) => page.originalIndex !== index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Reordenar Páginas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-800">
            Arraste e solte as páginas para reordená-las, ou use os botões de seta para mover uma página por vez.
          </p>
        </div>

        {/* Pages Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pages.map((pageInfo, index) => (
              <div
                key={`${pageInfo.pageNumber}-${index}`}
                className={`relative border-2 rounded-lg p-4 bg-white transition-all duration-200 ${
                  draggedIndex === index 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Page Number Badge */}
                <div className="absolute -top-3 -left-3 bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center z-10">
                  {index + 1}
                </div>

                {/* Move Controls */}
                <div className="absolute -top-3 -right-3 flex flex-col space-y-1">
                  <button
                    onClick={() => movePageUp(index)}
                    disabled={index === 0}
                    className="bg-gray-600 text-white p-1.5 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    title="Mover para cima"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => movePageDown(index)}
                    disabled={index === pages.length - 1}
                    className="bg-gray-600 text-white p-1.5 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                {/* Page Preview */}
                <div className="flex flex-col items-center space-y-3">
                  {/* Page Number Header */}
                  <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md w-full">
                    Página {pageInfo.pageNumber}
                  </div>
                  
                  <div className="border border-gray-300 bg-gray-50 overflow-hidden rounded shadow-sm">
                    {pdfUrl && (
                      <Document
                        file={pdfUrl}
                        loading={
                          <div className="w-48 h-64 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              <div className="text-xs text-gray-500">Carregando...</div>
                            </div>
                          </div>
                        }
                        error={
                          <div className="w-48 h-64 flex items-center justify-center bg-gray-100 text-red-500 text-xs text-center p-4">
                            <div>
                              <div className="text-2xl mb-2">⚠️</div>
                              <div>Erro ao carregar página</div>
                            </div>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageInfo.pageNumber}
                          scale={0.6}
                          width={192}
                          className="shadow-none"
                        />
                      </Document>
                    )}
                  </div>
                  
                  <div className="text-center">
                    {pageInfo.originalIndex !== index && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Original: Página {pageInfo.originalIndex + 1}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {hasChanges() ? 'Alterações detectadas' : 'Nenhuma alteração'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveOrder}
              disabled={!hasChanges() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Salvando...' : 'Salvar Ordem'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
