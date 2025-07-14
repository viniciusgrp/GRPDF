'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { X, Download, Eye, EyeOff } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import { usePDFWorker } from '@/hooks/usePDFWorker';

interface PageExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PageExportModal({ isOpen, onClose }: PageExportModalProps) {
  const { pdfUrl, totalPages, exportPages, isLoading } = usePDFEditor();
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  // Configurar worker do PDF.js
  usePDFWorker();

  useEffect(() => {
    if (isOpen) {
      // Limpar seleção ao abrir o modal
      setSelectedPages([]);
    }
  }, [isOpen]);

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  const selectAllPages = () => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  const handleExport = async () => {
    if (selectedPages.length === 0) return;
    
    try {
      // Converter para índices 0-based
      const pageIndices = selectedPages.map(p => p - 1);
      await exportPages(pageIndices);
      onClose();
    } catch (error) {
      console.error('Erro ao exportar páginas:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Exportar Páginas</h2>
            <p className="text-sm text-gray-600 mt-1">
              Selecione as páginas que deseja exportar para um novo PDF
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={selectAllPages}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              {selectedPages.length === totalPages ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Desmarcar Todas</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Selecionar Todas</span>
                </>
              )}
            </button>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedPages.length}</span> de {totalPages} páginas selecionadas
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Clique nas páginas para selecioná-las
          </div>
        </div>

        {/* Pages Grid */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isSelected = selectedPages.includes(pageNumber);
              
              return (
                <div
                  key={pageNumber}
                  className={`relative cursor-pointer group transition-all duration-200 ${
                    isSelected 
                      ? 'transform scale-105' 
                      : 'hover:transform hover:scale-102'
                  }`}
                  onClick={() => togglePageSelection(pageNumber)}
                >
                  {/* Selection Overlay */}
                  <div className={`absolute inset-0 rounded-lg border-4 transition-all duration-200 z-10 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
                      : 'border-transparent group-hover:border-gray-300'
                  }`}>
                    {/* Selection Badge */}
                    <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-300 text-gray-600 group-hover:bg-gray-400'
                    }`}>
                      {isSelected ? '✓' : pageNumber}
                    </div>
                  </div>

                  {/* Page Preview Container */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    {/* Page Number Header */}
                    <div className={`px-3 py-2 text-center text-sm font-medium transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      Página {pageNumber}
                    </div>

                    {/* PDF Preview */}
                    <div className="p-4 flex justify-center">
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
                              pageNumber={pageNumber}
                              scale={0.6}
                              width={192} // 48 * 4 = 192px (w-48)
                              className="shadow-none"
                            />
                          </Document>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`px-3 py-2 text-center text-xs transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'bg-white text-gray-500'
                    }`}>
                      {isSelected ? 'Selecionada para exportar' : 'Clique para selecionar'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedPages.length === 0 && 'Nenhuma página selecionada'}
            {selectedPages.length === 1 && '1 página será exportada'}
            {selectedPages.length > 1 && `${selectedPages.length} páginas serão exportadas`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={selectedPages.length === 0 || isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>
                {isLoading ? 'Exportando...' : `Exportar ${selectedPages.length > 0 ? `(${selectedPages.length})` : ''}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
