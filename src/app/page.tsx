'use client';

import FileUpload from '@/components/FileUpload';
import PDFViewer from '@/components/PDFViewer';
import Toolbar from '@/components/Toolbar';
import { PDFEditorProvider, usePDFEditor } from '@/contexts/PDFEditorContext';
import { Upload, AlertCircle, RotateCcw, Plus, FilePlus } from 'lucide-react';

function HomeContent() {
  const { pdfFile, loadPDF, loadMultiplePDFs, error, clearError, resetEditor } = usePDFEditor();

  const handleFileUpload = (file: File) => {
    loadPDF(file);
  };

  const handleMultipleFilesUpload = (files: File[]) => {
    loadMultiplePDFs(files);
  };

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-3'>
              <Upload className='h-8 w-8 text-blue-600' />
              <h1 className='text-2xl font-bold text-gray-900'>GRPDF</h1>
              {pdfFile && (
                <span className='text-sm text-gray-500 ml-4'>
                  • {pdfFile.name}
                </span>
              )}
            </div>
            <div className='flex items-center space-x-3'>
              {pdfFile && (
                <>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'application/pdf';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          loadPDF(file);
                        }
                      };
                      input.click();
                    }}
                    className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm'
                    title='Carregar outro PDF'
                  >
                    <Plus className='h-4 w-4' />
                    <span>Novo PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja começar do zero? Todas as alterações não salvas serão perdidas.')) {
                        resetEditor();
                      }
                    }}
                    className='flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm'
                    title='Recomeçar do zero'
                  >
                    <RotateCcw className='h-4 w-4' />
                    <span>Recomeçar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
          <div className='bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3'>
            <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
            <span className='text-red-700'>{error}</span>
            <button
              onClick={clearError}
              className='ml-auto text-red-500 hover:text-red-700'
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {!pdfFile ? (
          /* Welcome Screen */
          <div className='text-center py-16'>
            <Upload className='mx-auto h-16 w-16 text-blue-500 mb-6' />
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Editor de PDF Completo
            </h2>
            <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
              Selecione um ou múltiplos PDFs para unir, reordene páginas 
              e exporte páginas selecionadas. Interface simples e intuitiva para 
              edição profissional de PDFs.
            </p>
            <FileUpload 
              onFileUpload={handleFileUpload} 
              onMultipleFilesUpload={handleMultipleFilesUpload}
            />

            {/* Features Grid */}
            <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                  <RotateCcw className='h-6 w-6 text-purple-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Gerenciar Páginas
                </h3>
                <p className='text-gray-600 text-sm'>
                  Reordene, duplique, exclua e exporte páginas
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                  <Plus className='h-6 w-6 text-orange-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Unir e Carregar PDFs
                </h3>
                <p className='text-gray-600 text-sm'>
                  Selecione múltiplos PDFs para unir automaticamente ou adicione arquivos ao documento atual
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                  <FilePlus className='h-6 w-6 text-green-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Páginas em Branco
                </h3>
                <p className='text-gray-600 text-sm'>
                  Adicione páginas em branco ao documento
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Editor Interface */
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Toolbar */}
            <div className='lg:col-span-1'>
              <Toolbar />
            </div>

            {/* PDF Viewer */}
            <div className='lg:col-span-3'>
              <PDFViewer />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <PDFEditorProvider>
      <HomeContent />
    </PDFEditorProvider>
  );
}
