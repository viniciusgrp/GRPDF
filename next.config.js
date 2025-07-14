/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    // Configuração para PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.min.js': 'pdfjs-dist/legacy/build/pdf.worker.min.js',
    };
    
    return config;
  },
};

module.exports = nextConfig;
