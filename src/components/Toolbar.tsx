'use client';

import { useState } from 'react';
import { 
  Copy, 
  Download, 
  Trash2,
  Plus,
  Move,
  FileDown,
  FilePlus
} from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import { PageReorderModal } from './PageReorderModal';
import { PageExportModal } from './PageExportModal';

export default function Toolbar() {
  const { 
    currentPage, 
    totalPages, 
    isLoading, 
    savePDF,
    duplicatePage,
    deletePage,
    mergePDF,
    addBlankPage
  } = usePDFEditor();

  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleDuplicatePage = () => {
    duplicatePage(currentPage - 1);
  };

  const handleDeletePage = () => {
    if (confirm(`Tem certeza que deseja excluir a página ${currentPage}?`)) {
      deletePage(currentPage - 1);
    }
  };

  const handleExportPages = () => {
    setShowExportModal(true);
  };

  const handleMergePDF = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        mergePDF(file);
      }
    };
    input.click();
  };

  const tools = [
    {
      category: 'Páginas',
      items: [
        { 
          icon: Copy, 
          label: 'Duplicar Página', 
          action: handleDuplicatePage,
          active: false
        },
        { 
          icon: FileDown, 
          label: 'Exportar Páginas', 
          action: handleExportPages,
          active: false
        },
        { 
          icon: Move, 
          label: 'Reordenar', 
          action: () => setShowReorderModal(true),
          active: false
        },
        { 
          icon: Trash2, 
          label: 'Excluir Página', 
          action: handleDeletePage,
          active: false,
          disabled: totalPages <= 1
        },
      ]
    },
    {
      category: 'Arquivo',
      items: [
        { 
          icon: Download, 
          label: 'Salvar PDF', 
          action: savePDF,
          active: false
        },
        { 
          icon: Plus, 
          label: 'Unir PDF', 
          action: handleMergePDF,
          active: false
        },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Ferramentas</h2>
        <p className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </p>
      </div>

      {tools.map((toolCategory, categoryIndex) => (
        <div key={categoryIndex} className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {toolCategory.category}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {toolCategory.items.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={index}
                  onClick={tool.action}
                  disabled={isLoading || tool.disabled}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all
                    ${tool.active 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }
                    ${(isLoading || tool.disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <IconComponent className="h-5 w-5 mb-1" />
                  <span className="text-center leading-tight">
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="border-t pt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          Ações Rápidas
        </h3>
        <div className="space-y-2">
          <button 
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
            onClick={savePDF}
          >
            <div className="flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Baixar PDF</span>
            </div>
          </button>
        </div>
      </div>

      {/* Indicador de carregamento */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Processando...</p>
        </div>
      )}

      {/* Modal de reordenação de páginas */}
      {showReorderModal && (
        <PageReorderModal
          isOpen={showReorderModal}
          onClose={() => setShowReorderModal(false)}
        />
      )}

      {/* Modal de exportação de páginas */}
      {showExportModal && (
        <PageExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
