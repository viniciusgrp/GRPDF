# GRPDF - Editor de PDF Online - Feito com IA

Um editor de PDF moderno e intuitivo construído com Next.js 15 e TypeScript, permitindo edição completa de documentos PDF diretamente no navegador.

## 🚀 Funcionalidades Implementadas

### ✅ Gerenciamento de Páginas
- **Duplicar Página**: Criar uma cópia exata da página atual
- **Excluir Página**: Remover páginas indesejadas (mínimo de 1 página)
- **Extrair Páginas**: Selecionar e exportar páginas específicas com interface visual
- **🆕 Reordenar Páginas**: Modal interativo com miniaturas das páginas para reorganização via drag-and-drop ou botões de seta

### ✅ Recursos de Arquivo
- **Carregar PDF**: Upload de arquivos PDF para edição
- **Salvar PDF**: Download do documento editado
- **🆕 Adicionar PDF**: Mesclar páginas de outros PDFs ao documento atual sem perder o conteúdo

### ✅ Navegação e Visualização
- **Navegação por Páginas**: Botões anterior/próxima e indicador de página atual
- **Zoom**: Controles de zoom in/out com indicador percentual
- **Visualização em Tempo Real**: Todas as alterações são refletidas imediatamente

### ✅ Interface Intuitiva
- **Toolbar Organizado**: Ferramentas categorizadas por funcionalidade
- **Modais Interativos**: Interfaces claras para entrada de dados
- **Feedback Visual**: Indicadores de carregamento e estados visuais
- **Responsivo**: Design adaptável para diferentes tamanhos de tela
- **🆕 Reset**: Botão para voltar ao início e carregar um novo PDF

## 🛠️ Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[pdf-lib](https://pdf-lib.js.org/)** - Manipulação de PDFs
- **[react-pdf](https://github.com/wojtekmaj/react-pdf)** - Visualização de PDFs
- **[react-dropzone](https://react-dropzone.js.org/)** - Upload de arquivos
- **[Lucide React](https://lucide.dev/)** - Ícones modernos

## 🏁 Começando

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/grpdf.git
cd grpdf
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router (Next.js 15)
│   ├── globals.css     # Estilos globais
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página inicial
├── components/          # Componentes reutilizáveis
│   ├── FileUpload.tsx  # Upload de arquivos
│   ├── PDFViewer.tsx   # Visualizador de PDF
│   └── Toolbar.tsx     # Barra de ferramentas
├── lib/                 # Utilitários e configurações
├── types/               # Definições de tipos TypeScript
└── utils/               # Funções auxiliares
```

## 🎯 Roadmap

- [ ] **V1.0**: Funcionalidades básicas de edição
- [ ] **V1.1**: Colaboração em tempo real
- [ ] **V1.2**: Templates e modelos predefinidos
- [ ] **V1.3**: OCR para reconhecimento de texto
- [ ] **V1.4**: Assinatura digital
- [ ] **V2.0**: API para integração externa

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua funcionalidade (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Se você encontrar problemas ou tiver dúvidas:

- 📧 Email: suporte@grpdf.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/grpdf/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/seu-usuario/grpdf/wiki)

---

Feito com ❤️ para facilitar o trabalho com PDFs
