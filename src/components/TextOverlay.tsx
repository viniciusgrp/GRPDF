'use client';

import React, { useState } from 'react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface TextOverlayProps {
  scale: number;
  pageNumber: number;
}

export function TextOverlay({ scale, pageNumber }: TextOverlayProps) {
  const { textElements, editingTextId, startEditingText, updateText, finishEditingText, deleteText } = usePDFEditor();
  const [editingValue, setEditingValue] = useState('');

  const pageTextElements = textElements.filter(element => element.page === pageNumber - 1);

  const handleTextClick = (textElement: any) => {
    setEditingValue(textElement.text);
    startEditingText(textElement.id);
  };

  const handleTextUpdate = async (textId: string) => {
    if (editingValue.trim()) {
      await updateText(textId, editingValue);
    }
    setEditingValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, textId: string) => {
    if (e.key === 'Enter') {
      handleTextUpdate(textId);
    } else if (e.key === 'Escape') {
      finishEditingText();
      setEditingValue('');
    }
  };

  const handleDeleteText = async (e: React.MouseEvent, textId: string) => {
    e.stopPropagation();
    await deleteText(textId);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pageTextElements.map((element) => (
        <div
          key={element.id}
          className="absolute pointer-events-auto group"
          style={{
            left: element.x * scale,
            bottom: element.y * scale, // Usar bottom em vez de top para melhor posicionamento
            fontSize: element.fontSize * scale,
            color: element.color,
          }}
        >
          {editingTextId === element.id ? (
            <input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => handleTextUpdate(element.id)}
              onKeyDown={(e) => handleKeyPress(e, element.id)}
              className="bg-white border-2 border-blue-500 px-2 py-1 text-black min-w-[100px] rounded shadow-lg"
              style={{ fontSize: element.fontSize * scale }}
              autoFocus
            />
          ) : (
            <div
              onClick={() => handleTextClick(element)}
              className="cursor-pointer hover:bg-blue-100 hover:bg-opacity-80 px-2 py-1 rounded relative border border-transparent hover:border-blue-300 transition-all duration-200 bg-white text-black shadow-lg"
              title="Clique para editar o texto"
              style={{ 
                color: '#000000', 
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                textShadow: '0 0 2px white, 0 0 4px white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {element.text}
              <button
                onClick={(e) => handleDeleteText(e, element.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md hover:bg-red-600"
                title="Deletar texto"
              >
                ×
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
