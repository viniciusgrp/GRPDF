import { useEffect } from 'react';
import { pdfjs } from 'react-pdf';

export const usePDFWorker = () => {
  useEffect(() => {
    const setupWorker = () => {
      if (typeof window === 'undefined') return;
      
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        // Usar worker local que foi copiado do node_modules
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        // PDF.js worker configurado com arquivo local
      }
    };

    setupWorker();
  }, []);
};
