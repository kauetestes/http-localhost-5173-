
# Formato de Dados do Arquivo de Entrada (.xlsm)

Este documento especifica o formato exato que o arquivo Microsoft Excel (com macros, `.xlsm`) deve seguir para ser importado corretamente pela aplicação de Dashboard de Faturamento. Aderir a este formato é crucial para evitar erros durante o processo de upload e parsing.

## Requisitos Gerais

1.  **Formato do Arquivo**: O arquivo deve ser do tipo `.xlsm` (Planilha Habilitada para Macro do Excel), embora o sistema processe apenas os dados e não execute macros.
2.  **Nome da Planilha**: O arquivo Excel deve conter uma planilha **exatamente** com o nome `FatLISTA`. O sistema procura por este nome específico para extrair os dados.

## Estrutura das Colunas

A planilha `FatLISTA` deve conter uma linha de cabeçalho seguida pelas linhas de dados. Os nomes dos cabeçalhos das colunas devem corresponder exatamente aos listados abaixo. O parser remove espaços em branco no início e no fim dos nomes dos cabeçalhos, mas é recomendado que os nomes sejam exatos para evitar problemas.

### Colunas Obrigatórias

As seguintes colunas **devem** estar presentes no arquivo:

| Nome da Coluna                                                              | Tipo de Dado Esperado | Descrição                                                                                               |
| --------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| `NOME_CLIENTE`                                                              | Texto                 | O nome do cliente ou a razão social da empresa.                                                         |
| `CH_IT_NF_NUM_NFIS`                                                         | Número                | O número que identifica a nota fiscal.                                                                  |
| `QTDE_ITEM_FATUR`                                                           | Número                | A quantidade de itens faturados na transação.                                                           |
| `VALOR_UNITARIO`                                                            | Número                | O preço de uma única unidade do item.                                                                   |
| `VALOR_FATURADO`                                                            | Número                | O valor total do item (`QTDE_ITEM_FATUR` x `VALOR_UNITARIO`).                                             |
| `DATA_EMISSAO`                                                              | Número (Serial Date)  | A data de emissão no formato de número de série do Excel.                                               |
| `ANO`                                                                       | Número                | O ano extraído da `DATA_EMISSAO`.                                                                       |
| `MES`                                                                       | Número                | O mês extraído da `DATA_EMISSAO`.                                                                       |
| `DESCRICAO_ITEM`                                                            | Texto                 | A descrição completa do produto vendido.                                                                |
| `LINHA_PRODUTO`                                                             | Texto/Número          | O código ou nome da linha de produto à qual o item pertence.                                            |
| `GRUPO_ESTRUTURA`                                                           | Texto                 | O grupo principal ao qual o produto pertence (ex: "SP015").                                             |
| `FATU_060.CH_IT_NF_NUM_NFIS\|\|'.'\|\|FATU_060.SEQ_ITEM_NFISC\|\|'.'\|\|FATU_050.CGC_9` | Texto                 | Um identificador único para cada linha de item da nota fiscal. É usado como ID único no sistema.      |

### Tratamento de Dados

-   **Números**: Colunas numéricas como `QTDE_ITEM_FATUR` e `VALOR_FATURADO` serão convertidas para o tipo `Number`. Se a conversão falhar, o valor será `0`.
-   **Datas**: A coluna `DATA_EMISSAO` deve ser um número serial do Excel. O sistema a converterá para um objeto `Date` do JavaScript.
-   **ID Único**: A coluna com o nome longo e concatenado é essencial para a identificação única de cada registro na tabela. A ausência de um valor nesta coluna fará com que a linha seja ignorada.

## Tratamento de Erros

Se o arquivo não seguir as especificações acima, a aplicação exibirá uma mensagem de erro na interface de upload:

-   **Planilha não encontrada**: Se a planilha `FatLISTA` não existir.
-   **Colunas obrigatórias não encontradas**: Se uma ou mais das colunas listadas acima estiverem faltando no cabeçalho.
-   **Planilha vazia**: Se o arquivo não contiver nenhuma linha de dados.
-   **Erro de processamento**: Para outros erros genéricos que possam ocorrer durante a leitura do arquivo.
