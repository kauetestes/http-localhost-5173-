
# Arquitetura do Software

Este documento descreve a arquitetura da aplicação "Dashboard de Faturamento", detalhando a estrutura de componentes, o gerenciamento de estado e o fluxo de dados.

## Visão Geral

A aplicação é uma SPA (Single Page Application) construída em React com TypeScript. A arquitetura é centrada em componentes, onde cada parte da interface é um componente desacoplado com responsabilidades bem definidas. O estado principal é gerenciado no componente `App.tsx` e distribuído para os componentes filhos via props. A lógica de manipulação de dados é encapsulada em um hook customizado (`useBillingData`).

## Fluxo de Dados

O fluxo de dados da aplicação é unidirecional, o que torna o estado mais previsível e fácil de depurar.

1.  **Upload do Arquivo**: O usuário interage com `FileUpload.tsx`, que envia o arquivo para `App.tsx`.
2.  **Processamento**: `App.tsx` chama a função `parseXlsmFile` de `utils/fileParser.ts` para ler e validar o arquivo `.xlsm`.
3.  **Gerenciamento de Estado**: Se o processamento for bem-sucedido, os dados são armazenados no estado de `App.tsx`. Caso contrário, uma mensagem de erro é armazenada.
4.  **Renderização do Dashboard**: `App.tsx` renderiza condicionalmente o `Dashboard.tsx`, passando os dados processados como props.
5.  **Manipulação de Dados**: `Dashboard.tsx` utiliza o hook `useBillingData` para obter os dados filtrados, ordenados e paginados.
6.  **Interação do Usuário**: Ações do usuário nos componentes (ex: `FilterPanel.tsx`, `BillingTable.tsx`) disparam funções (passadas via props) que atualizam o estado no hook `useBillingData`, que por sua vez causa uma nova renderização com os dados atualizados.
7.  **Análise de IA**: O usuário clica em um botão no `Dashboard.tsx`, que envia os dados filtrados atuais para a função `getGeminiAnalysis` em `utils/analysis.ts`. A resposta é exibida em um modal (`GeminiAnalysisModal.tsx`).

## Estrutura de Componentes

### Componentes Principais

-   **`App.tsx`**: O componente raiz. Gerencia o estado global da aplicação, como os dados de faturamento, erros de upload e o estado de carregamento. Orquestra a renderização entre a tela de upload e o dashboard.

-   **`FileUpload.tsx`**: Uma interface de usuário para upload de arquivos. Lida com a interação de arrastar e soltar (drag-and-drop) e o feedback visual durante o upload e processamento. É um componente "burro" que apenas notifica o `App.tsx` quando um arquivo é selecionado.

-   **`Dashboard.tsx`**: O componente principal de visualização. Recebe os dados brutos e os passa para o hook `useBillingData`. Compõe a interface do dashboard renderizando `FilterPanel`, `SummaryCards`, `RevenueChart`, e `BillingTable`.

### Componentes de Visualização

-   **`FilterPanel.tsx`**: Contém todos os controles de filtro (inputs de texto, selects). Recebe o estado atual dos filtros e uma função `onFilterChange` para notificar o hook `useBillingData` sobre as mudanças.

-   **`SummaryCards.tsx`**: Exibe os KPIs (Key Performance Indicators) principais, como faturamento total, clientes únicos, etc. Recebe os dados já filtrados e calcula os valores de resumo.

-   **`RevenueChart.tsx`**: Renderiza um gráfico de barras do faturamento mensal usando a biblioteca Recharts. Recebe os dados filtrados e os processa internamente para se adequar ao formato exigido pelo gráfico.

-   **`BillingTable.tsx`**: Apresenta os dados detalhados em uma tabela paginada e ordenável. Lida com a renderização das linhas e a interface de paginação.

### Hooks

-   **`useBillingData.ts`**: Um hook customizado que encapsula toda a lógica de negócio relacionada aos dados:
    -   Filtragem baseada nos critérios do usuário.
    -   Ordenação ascendente/descendente por coluna.
    -   Paginação dos resultados.
    -   Cálculo de valores únicos para preencher os dropdowns dos filtros.
    -   Isso mantém os componentes de visualização limpos e focados na renderização.

### Utilitários

-   **`utils/fileParser.ts`**: Contém a lógica para ler e processar o arquivo `.xlsm`. É responsável por:
    -   Usar a biblioteca `xlsx` para ler o arquivo.
    -   Validar a existência da planilha "FatLISTA".
    -   Verificar se todas as colunas obrigatórias estão presentes.
    -   Mapear os dados brutos para a interface `BillingRecord`.
    -   Converter as datas do formato serial do Excel para objetos `Date` do JavaScript.

-   **`utils/analysis.ts`**: Módulo para interagir com a API do Gemini. Prepara o prompt com base nos dados filtrados e gerencia a chamada à API.
