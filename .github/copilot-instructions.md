<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# GRPDF - Editor de PDF Online

Este é um projeto Next.js com TypeScript focado na edição e manipulação de arquivos PDF.

## Contexto do Projeto

O GRPDF é uma plataforma web onde usuários podem:
- Fazer upload de arquivos PDF
- Editar textos existentes
- Adicionar novos elementos (imagens, tabelas, formas)
- Reorganizar páginas (reordenar, extrair, duplicar)
- Unir múltiplos PDFs
- Comprimir arquivos
- Exportar páginas selecionadas

## Tecnologias Principais

- **Next.js 15** com App Router
- **TypeScript** para tipagem
- **Tailwind CSS** para estilização
- **pdf-lib** para manipulação de PDFs
- **react-pdf** para visualização
- **react-dropzone** para upload de arquivos
- **lucide-react** para ícones

## Diretrizes de Desenvolvimento

1. **Componentes**: Use componentes funcionais com hooks
2. **Styling**: Prefira Tailwind CSS com classes utilitárias
3. **Tipagem**: Sempre use TypeScript com tipagem explícita
4. **PDF Handling**: Use pdf-lib para edição e react-pdf para visualização
5. **UX**: Foque em uma interface limpa e intuitiva
6. **Performance**: Otimize para upload e processamento de arquivos grandes

## Estrutura de Pastas

```
src/
├── app/                 # App Router (Next.js 15)
├── components/          # Componentes reutilizáveis
├── lib/                 # Utilitários e configurações
├── types/               # Definições de tipos TypeScript
└── utils/               # Funções auxiliares
```

## Padrões de Código

- Use 'use client' para componentes que precisam de interatividade
- Implemente loading states para operações assíncronas
- Adicione tratamento de erro adequado
- Mantenha componentes pequenos e focados
- Use nomes descritivos para funções e variáveis
