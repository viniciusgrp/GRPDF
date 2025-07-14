import { pdfjs } from 'react-pdf';

// Configuração global do worker do PDF.js
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  // Usar jsdelivr que é mais confiável que unpkg
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

export { pdfjs };
