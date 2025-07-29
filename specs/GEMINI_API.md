
# Integração com a API do Google Gemini

Este documento detalha a implementação da funcionalidade de análise de dados por Inteligência Artificial, utilizando a API do Google Gemini.

## Visão Geral

Para enriquecer a análise de dados, a aplicação integra a API do Gemini para gerar insights textuais com base nos dados atualmente exibidos no dashboard. Um usuário pode, a qualquer momento, solicitar uma análise dos dados filtrados, e a IA fornecerá um resumo com tendências, pontos de destaque e possíveis observações.

## Requisitos de Configuração

Para que a funcionalidade de análise com IA funcione, uma **chave de API do Google Gemini** é necessária.

-   **Variável de Ambiente**: A chave de API deve ser configurada como uma variável de ambiente chamada `API_KEY`. O código-fonte acessa essa chave através de `process.env.API_KEY`.
-   **Modelo Utilizado**: A integração está configurada para usar o modelo `gemini-2.5-flash`, que oferece um bom equilíbrio entre velocidade e capacidade de análise para esta tarefa.

## Fluxo de Trabalho da Análise

1.  **Acionamento pelo Usuário**: O usuário clica no botão "Analisar com IA" no `Dashboard.tsx`.
2.  **Coleta de Dados**: O estado atual dos `filteredData` (dados já processados pelos filtros selecionados) é capturado.
3.  **Chamada da Função de Análise**: Os dados filtrados são passados para a função `getGeminiAnalysis` no arquivo `utils/analysis.ts`.
4.  **Abertura do Modal**: Imediatamente, o componente `GeminiAnalysisModal.tsx` é renderizado em um estado de "carregamento", fornecendo feedback visual ao usuário.
5.  **Preparação do Prompt**: Dentro de `getGeminiAnalysis`, os dados são sumarizados e formatados em um prompt estruturado. Isso inclui:
    -   Cálculo de KPIs (Faturamento total, total de itens, número de clientes).
    -   Extração dos 5 principais produtos e 5 principais clientes com base no faturamento.
    -   Formatação de um texto claro e conciso que instrui a IA sobre o que fazer.
6.  **Requisição à API**: Uma requisição de streaming é enviada para a API do Gemini com o prompt gerado.
7.  **Exibição do Resultado**:
    -   À medida que a API retorna os "chunks" de texto, eles são exibidos em tempo real no modal.
    -   O resultado final é formatado em Markdown para melhor legibilidade (títulos, listas, etc.).
8.  **Tratamento de Erros**: Se ocorrer um erro na chamada da API (ex: chave inválida, problema de rede), o modal exibirá uma mensagem de erro clara.

## Estrutura do Prompt

Para garantir uma resposta consistente e útil, o prompt enviado ao Gemini é cuidadosamente estruturado. Abaixo está um exemplo do template do prompt:

```text
Você é um especialista em análise de dados financeiros. Sua tarefa é analisar os dados de faturamento fornecidos e gerar um relatório conciso com insights valiosos.

**Contexto da Análise:**
- Período de Análise: [Período derivado dos filtros de ano/mês]
- Faturamento Total (Filtro Atual): [Valor]
- Total de Itens Vendidos: [Valor]
- Número de Clientes Únicos: [Valor]

**Top 5 Clientes por Faturamento:**
1. [Nome Cliente 1]: [Valor]
2. [Nome Cliente 2]: [Valor]
...

**Top 5 Produtos por Faturamento:**
1. [Produto 1]: [Valor]
2. [Produto 2]: [Valor]
...

**Sua Tarefa:**
Com base nos dados acima, gere um relatório com o seguinte formato:

### Análise de Faturamento

#### 1. Destaques Gerais
   - [Insight sobre o faturamento total e o volume de vendas]
   - [Observação sobre a concentração de vendas em clientes ou produtos]

#### 2. Análise de Clientes
   - [Análise sobre os principais clientes. Eles são responsáveis por uma grande parte do faturamento?]
   - [Algum insight sobre a pulverização ou concentração de clientes?]

#### 3. Análise de Produtos
   - [Análise sobre os produtos mais vendidos. Existe algum produto que se destaca muito dos outros?]
   - [Sugestão ou observação baseada no desempenho dos produtos]

Seja direto, profissional e foque em insights acionáveis.
```
