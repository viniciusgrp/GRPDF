'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { pdfEditor } from '@/lib/pdfEditor';
import { fileToArrayBuffer, downloadArrayBuffer } from '@/utils/fileUtils';

interface PDFEditorState {
  // Estado do documento
  pdfFile: File | null;
  pdfUrl: string;
  pdfDocument: PDFDocument | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  
  // Estado de edição
  selectedTool: string | null;
  isEditing: boolean;
  elements: any[];
  
  // Estado de edição de texto
  editingTextId: string | null;
  textElements: TextElement[];
  
  // Estado de carregamento
  isLoading: boolean;
  error: string | null;
}

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  page: number;
  fontSize: number;
  color: string;
}

interface PDFEditorActions {
  // Ações de arquivo
  loadPDF: (file: File) => Promise<void>;
  loadMultiplePDFs: (files: File[]) => Promise<void>;
  savePDF: () => Promise<void>;
  exportPages: (pageIndices: number[]) => Promise<void>;
  mergePDF: (file: File) => Promise<void>;
  
  // Ações de página
  goToPage: (pageNumber: number) => void;
  rotatePage: (pageIndex: number, degrees: number) => Promise<void>;
  duplicatePage: (pageIndex: number) => Promise<void>;
  deletePage: (pageIndex: number) => Promise<void>;
  extractPages: (pageIndices: number[]) => Promise<void>;
  reorderPages: (newOrder: number[]) => Promise<void>;
  addBlankPage: () => Promise<void>;
  
  // Ações de edição
  setSelectedTool: (tool: string | null) => void;
  addText: (text: string, x: number, y: number) => Promise<void>;
  addImage: (imageFile: File, x: number, y: number) => Promise<void>;
  
  // Ações de edição de texto
  startEditingText: (textId: string) => void;
  updateText: (textId: string, newText: string) => Promise<void>;
  finishEditingText: () => void;
  deleteText: (textId: string) => Promise<void>;
  
  // Ações de zoom e navegação
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  
  // Ações de controle
  resetEditor: () => void;
  
  // Utilitários
  clearError: () => void;
}

type PDFEditorContextType = PDFEditorState & PDFEditorActions;

const PDFEditorContext = createContext<PDFEditorContextType | null>(null);

export function PDFEditorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PDFEditorState>({
    pdfFile: null,
    pdfUrl: '',
    pdfDocument: null,
    currentPage: 1,
    totalPages: 0,
    zoom: 1.0,
    selectedTool: null,
    isEditing: false,
    elements: [],
    editingTextId: null,
    textElements: [],
    isLoading: false,
    error: null,
  });

  const updateState = (updates: Partial<PDFEditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const loadPDF = useCallback(async (file: File) => {
    try {
      updateState({ isLoading: true, error: null });
      
      const arrayBuffer = await fileToArrayBuffer(file);
      await pdfEditor.loadPDF(arrayBuffer);
      
      const url = URL.createObjectURL(file);
      const totalPages = pdfEditor.getPageCount();
      
      updateState({
        pdfFile: file,
        pdfUrl: url,
        totalPages,
        currentPage: 1,
        isLoading: false,
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao carregar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, []);

  const savePDF = useCallback(async () => {
    try {
      updateState({ isLoading: true });
      
      const pdfBytes = await pdfEditor.save();
      const fileName = state.pdfFile?.name.replace('.pdf', '_editado.pdf') || 'documento_editado.pdf';
      
      downloadArrayBuffer(pdfBytes, fileName);
      updateState({ isLoading: false });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao salvar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.pdfFile]);

  const exportPages = useCallback(async (pageIndices: number[]) => {
    try {
      updateState({ isLoading: true });
      
      const pdfBytes = await pdfEditor.extractPages(pageIndices);
      const fileName = `${state.pdfFile?.name.replace('.pdf', '')}_paginas_${pageIndices.join('-')}.pdf` || 'paginas_exportadas.pdf';
      
      downloadArrayBuffer(pdfBytes, fileName);
      updateState({ isLoading: false });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao exportar páginas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.pdfFile]);

  const rotatePage = useCallback(async (pageIndex: number, degrees: number) => {
    try {
      updateState({ isLoading: true });
      
      await pdfEditor.rotatePage(pageIndex, degrees);
      
      // Recarregar o PDF para mostrar as mudanças
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ pdfUrl: newUrl, isLoading: false });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao rotacionar página: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, []);

  const duplicatePage = useCallback(async (pageIndex: number) => {
    try {
      updateState({ isLoading: true });
      
      await pdfEditor.duplicatePage(pageIndex);
      const newTotalPages = pdfEditor.getPageCount();
      
      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ 
        pdfUrl: newUrl, 
        totalPages: newTotalPages,
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao duplicar página: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, []);

  const deletePage = useCallback(async (pageIndex: number) => {
    try {
      updateState({ isLoading: true });
      
      await pdfEditor.deletePage(pageIndex);
      const newTotalPages = pdfEditor.getPageCount();
      
      // Ajustar página atual se necessário
      const newCurrentPage = Math.min(state.currentPage, newTotalPages);
      
      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ 
        pdfUrl: newUrl, 
        totalPages: newTotalPages,
        currentPage: newCurrentPage,
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao excluir página: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.currentPage]);

  const addText = useCallback(async (text: string, x: number, y: number) => {
    try {
      updateState({ isLoading: true });
      
      await pdfEditor.addTextToPage(state.currentPage - 1, text, x, y, {
        fontSize: 12,
        color: { r: 0, g: 0, b: 0 }
      });

      // Criar novo elemento de texto
      const newTextElement: TextElement = {
        id: `text-${Date.now()}-${Math.random()}`,
        text,
        x,
        y,
        page: state.currentPage - 1,
        fontSize: 12,
        color: '#000000'
      };
      
      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ 
        pdfUrl: newUrl, 
        textElements: [...state.textElements, newTextElement],
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao adicionar texto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.currentPage, state.textElements]);

  const addImage = useCallback(async (imageFile: File, x: number, y: number) => {
    try {
      updateState({ isLoading: true });
      
      const imageBytes = await fileToArrayBuffer(imageFile);
      const imageType = imageFile.type.includes('png') ? 'png' : 'jpg';
      
      await pdfEditor.addImageToPage(
        state.currentPage - 1, 
        imageBytes, 
        x, 
        y, 
        100, // width
        100, // height
        imageType
      );
      
      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ pdfUrl: newUrl, isLoading: false });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao adicionar imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.currentPage]);

  // Funções de edição de texto
  const startEditingText = useCallback((textId: string) => {
    updateState({ editingTextId: textId });
  }, []);

  const updateText = useCallback(async (textId: string, newText: string) => {
    try {
      updateState({ isLoading: true });
      
      const textElement = state.textElements.find(el => el.id === textId);
      if (!textElement) {
        throw new Error('Elemento de texto não encontrado');
      }

      // Remover o texto antigo e adicionar o novo
      await pdfEditor.removeText(textElement.page, textElement.x, textElement.y);
      await pdfEditor.addTextToPage(
        textElement.page,
        newText,
        textElement.x,
        textElement.y,
        { fontSize: textElement.fontSize }
      );

      // Atualizar o elemento na lista
      const updatedTextElements = state.textElements.map(el =>
        el.id === textId ? { ...el, text: newText } : el
      );

      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ 
        pdfUrl: newUrl, 
        textElements: updatedTextElements,
        editingTextId: null,
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao atualizar texto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.textElements]);

  const finishEditingText = useCallback(() => {
    updateState({ editingTextId: null });
  }, []);

  const deleteText = useCallback(async (textId: string) => {
    try {
      updateState({ isLoading: true });
      
      const textElement = state.textElements.find(el => el.id === textId);
      if (!textElement) {
        throw new Error('Elemento de texto não encontrado');
      }

      // Remover o texto do PDF
      await pdfEditor.removeText(textElement.page, textElement.x, textElement.y);

      // Remover da lista de elementos
      const updatedTextElements = state.textElements.filter(el => el.id !== textId);

      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      updateState({ 
        pdfUrl: newUrl, 
        textElements: updatedTextElements,
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao deletar texto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, [state.textElements]);

  const mergePDF = useCallback(async (file: File) => {
    try {
      updateState({ isLoading: true });
      
      const arrayBuffer = await fileToArrayBuffer(file);
      await pdfEditor.mergePDF(arrayBuffer);
      
      // Recarregar o PDF atualizado
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      const newTotalPages = pdfEditor.getPageCount();
      
      updateState({ 
        pdfUrl: newUrl, 
        totalPages: newTotalPages,
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao mesclar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, []);

  const reorderPages = useCallback(async (newOrder: number[]) => {
    try {
      updateState({ isLoading: true });
      
      await pdfEditor.reorderPages(newOrder);
      
      // Recarregar o PDF
      const pdfBytes = await pdfEditor.save();
      const newUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      
      // Resetar para a primeira página após reordenação
      updateState({ 
        pdfUrl: newUrl,
        currentPage: 1,
        isLoading: false 
      });
    } catch (error) {
      updateState({
        isLoading: false,
        error: `Erro ao reordenar páginas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    }
  }, []);

  const resetEditor = useCallback(() => {
    // Limpar URL anterior se existir
    if (state.pdfUrl) {
      URL.revokeObjectURL(state.pdfUrl);
    }
    
    // Resetar todo o estado para os valores iniciais
    setState({
      pdfFile: null,
      pdfUrl: '',
      pdfDocument: null,
      currentPage: 1,
      totalPages: 0,
      zoom: 1.0,
      selectedTool: null,
      isEditing: false,
      elements: [],
      editingTextId: null,
      textElements: [],
      isLoading: false,
      error: null,
    });
    
    // Limpar o editor PDF
    pdfEditor.clearDocument();
  }, [state.pdfUrl]);

  // Função para adicionar página em branco
  const addBlankPage = useCallback(async () => {
    if (!state.pdfDocument || pdfEditor.getPageCount() === 0) {
      updateState({ error: 'Nenhum documento PDF carregado' });
      return;
    }
    
    try {
      updateState({ isLoading: true, error: null });
      
      // Usar a função do pdfEditor para adicionar página em branco
      const success = await pdfEditor.addBlankPage();
      
      if (success) {
        // Gerar nova URL do PDF atualizado
        const pdfBytes = await pdfEditor.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const newUrl = URL.createObjectURL(blob);
        
        // Limpar URL anterior se existir
        if (state.pdfUrl) {
          URL.revokeObjectURL(state.pdfUrl);
        }
        
        updateState({ 
          pdfUrl: newUrl,
          totalPages: state.totalPages + 1,
          currentPage: state.totalPages + 1 // Ir para a nova página
        });
      } else {
        updateState({ error: 'Falha ao adicionar página em branco' });
      }
    } catch (error) {
      console.error('Erro ao adicionar página em branco:', error);
      updateState({ error: 'Erro ao adicionar página em branco' });
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.pdfDocument, state.totalPages, state.pdfUrl]);

  // Função para carregar múltiplos PDFs
  const loadMultiplePDFs = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    try {
      updateState({ isLoading: true, error: null });
      
      // Se só há um arquivo, usar loadPDF normal
      if (files.length === 1) {
        await loadPDF(files[0]);
        return;
      }
      
      // Para múltiplos arquivos, converter para ArrayBuffer
      const pdfBuffers: ArrayBuffer[] = [];
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        pdfBuffers.push(arrayBuffer);
      }
      
      // Usar a função mergePDFs existente
      const mergedPdfBytes = await pdfEditor.mergePDFs(pdfBuffers);
      
      // Criar um arquivo com o PDF unido
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const mergedFile = new File([blob], `documento-unido-${files.length}-pdfs.pdf`, { type: 'application/pdf' });
      
      // Carregar o arquivo unido usando loadPDF
      await loadPDF(mergedFile);
      
    } catch (error) {
      console.error('Erro ao carregar múltiplos PDFs:', error);
      updateState({ error: 'Erro ao carregar os arquivos PDF' });
    } finally {
      updateState({ isLoading: false });
    }
  }, [loadPDF]);

  const actions: PDFEditorActions = {
    loadPDF,
    loadMultiplePDFs,
    savePDF,
    exportPages,
    mergePDF,
    goToPage: (pageNumber: number) => updateState({ currentPage: pageNumber }),
    rotatePage,
    duplicatePage,
    deletePage,
    extractPages: exportPages,
    reorderPages,
    addBlankPage,
    setSelectedTool: (tool: string | null) => updateState({ selectedTool: tool }),
    addText,
    addImage,
    startEditingText,
    updateText,
    finishEditingText,
    deleteText,
    setZoom: (zoom: number) => updateState({ zoom }),
    zoomIn: () => updateState({ zoom: Math.min(state.zoom + 0.1, 2.0) }),
    zoomOut: () => updateState({ zoom: Math.max(state.zoom - 0.1, 0.5) }),
    clearError: () => updateState({ error: null }),
    resetEditor,
  };

  return (
    <PDFEditorContext.Provider value={{ ...state, ...actions }}>
      {children}
    </PDFEditorContext.Provider>
  );
}

export function usePDFEditor() {
  const context = useContext(PDFEditorContext);
  if (!context) {
    throw new Error('usePDFEditor must be used within a PDFEditorProvider');
  }
  return context;
}
