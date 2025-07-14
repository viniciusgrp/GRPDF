'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onMultipleFilesUpload: (files: File[]) => void;
}

export default function FileUpload({ onFileUpload, onMultipleFilesUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (acceptedFiles.length === 1) {
        onFileUpload(acceptedFiles[0]);
      } else {
        onMultipleFilesUpload(acceptedFiles);
      }
    }
  }, [onFileUpload, onMultipleFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          {isDragActive ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-blue-500" />
              <p className="text-blue-600 font-medium">
                Solte os arquivos PDF aqui...
              </p>
            </>
          ) : (
            <>
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  Arraste arquivos PDF ou clique para selecionar
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Escolher Arquivos
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Selecione um ou múltiplos arquivos PDF
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
