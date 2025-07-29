
# Dashboard de Faturamento Interativo

Este é um dashboard interativo para análise de dados de faturamento, construído com React, TypeScript e Tailwind CSS. A aplicação permite que os usuários façam upload de um arquivo `.xlsm`, visualizem os dados em gráficos e tabelas, apliquem filtros dinâmicos e obtenham insights gerados por IA com a API do Google Gemini.

## Funcionalidades

- **Upload de Arquivo**: Interface de arrastar e soltar para importar dados de faturamento de um arquivo `.xlsm`.
- **Dashboard Dinâmico**: Visualização dos dados com cards de resumo, gráfico de faturamento mensal e uma tabela detalhada.
- **Filtragem Avançada**: Filtre os dados por nome do cliente, linha de produto, ano e mês.
- **Ordenação de Dados**: Ordene a tabela clicando nos cabeçalhos das colunas.
- **Paginação**: Navegue facilmente por grandes volumes de dados na tabela.
- **Análise com IA**: Utilize a API do Gemini para gerar insights sobre os dados filtrados.
- **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts
- **Leitura de XLSM**: `xlsx` (SheetJS)
- **Análise de IA**: `@google/genai` (Google Gemini API)

## Estrutura do Projeto

```
/
├── components/         # Componentes React reutilizáveis
│   ├── BillingTable.tsx
│   ├── Dashboard.tsx
│   ├── FileUpload.tsx
│   ├── FilterPanel.tsx
│   ├── GeminiAnalysisModal.tsx  # (Seria adicionado com a feature do Gemini)
│   ├── RevenueChart.tsx
│   ├── SummaryCards.tsx
│   └── icons.tsx
├── data/               # Dados estáticos (se houver)
│   └── mockData.ts
├── hooks/              # Hooks customizados
│   └── useBillingData.ts
├── utils/              # Funções utilitárias
│   ├── analysis.ts     # (Seria adicionado com a feature do Gemini)
│   └── fileParser.ts
├── specs/              # Documentação do projeto
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── DATA_FORMAT.md
│   └── GEMINI_API.md
├── App.tsx             # Componente principal da aplicação
├── index.html          # Ponto de entrada HTML
├── index.tsx           # Ponto de entrada do React
├── metadata.json       # Metadados da aplicação
└── types.ts            # Definições de tipos TypeScript
```

## Como Executar o Projeto

Este projeto foi desenhado para ser executado em um ambiente de desenvolvimento web que suporte módulos ES6 e import maps, como o que é fornecido pela plataforma Glitch.

### Pré-requisitos

- Um navegador web moderno (Chrome, Firefox, Edge).
- Um arquivo de dados `.xlsm` seguindo o formato especificado em `specs/DATA_FORMAT.md`.
- (Opcional) Uma chave de API do Google Gemini para a funcionalidade de análise de IA, configurada como uma variável de ambiente `API_KEY`.

### Execução

1.  **Abra o `index.html`**: Carregue o arquivo `index.html` em um servidor de desenvolvimento local ou simplesmente abra-o no navegador.
2.  **Importe os Dados**: Na tela inicial, arraste e solte seu arquivo `.xlsm` ou clique para selecioná-lo.
3.  **Explore o Dashboard**: Se o arquivo for válido, o dashboard será populado com os dados. Use os filtros e as funcionalidades da tabela para analisar as informações.
4.  **Análise com IA**: Clique no botão "Analisar com IA" para obter insights sobre os dados filtrados (requer a chave de API do Gemini).
