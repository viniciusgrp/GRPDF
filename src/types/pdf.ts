// Type definitions for GRPDF project

export interface PDFFile {
  id: string;
  name: string;
  size: number;
  url: string;
  pageCount: number;
  lastModified: Date;
}

export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  thumbnailUrl?: string;
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  pageNumber: number;
}

export interface ImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  alt?: string;
}

export interface TableElement {
  id: string;
  x: number;
  y: number;
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
  pageNumber: number;
  data: string[][];
}

export interface ShapeElement {
  id: string;
  type: 'rectangle' | 'circle' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  pageNumber: number;
}

export type PDFElement = TextElement | ImageElement | TableElement | ShapeElement;

export interface EditorState {
  currentFile: PDFFile | null;
  currentPage: number;
  zoom: number;
  selectedElements: string[];
  elements: PDFElement[];
  history: PDFElement[][];
  historyIndex: number;
}

export interface ToolbarTool {
  id: string;
  name: string;
  icon: React.ComponentType;
  category: string;
  isActive?: boolean;
  action: () => void;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  operation: string;
  progress: number;
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  pages: number[] | 'all';
  quality?: number;
  compression?: boolean;
}

export interface MergeOptions {
  files: PDFFile[];
  order: number[];
  outputName: string;
}
