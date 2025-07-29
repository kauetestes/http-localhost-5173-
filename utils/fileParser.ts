
import * as XLSX from 'xlsx';
import { BillingRecord } from '../types';

function excelSerialDateToJSDate(serial: number): Date {
  // (serial - 25569) is the number of days since 1970-01-01.
  // * 86400000 converts days to milliseconds.
  return new Date((serial - 25569) * 86400000);
}

export const parseXlsmFile = (file: File): Promise<BillingRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
            return reject(new Error('Falha ao ler o arquivo.'));
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = 'FatLISTA';
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          return reject(new Error(`A planilha "${sheetName}" não foi encontrada no arquivo.`));
        }

        // Use { header: 1 } to get an array of arrays for robust header processing.
        const jsonDataRaw: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

        if (jsonDataRaw.length < 1) {
          return reject(new Error('A planilha está vazia.'));
        }

        // Trim headers to avoid issues with leading/trailing whitespace.
        const headers = jsonDataRaw[0].map(h => String(h || '').trim());
        const dataRows = jsonDataRaw.slice(1);

        const requiredColumns = [
            'NOME_CLIENTE', 'CH_IT_NF_NUM_NFIS', 'QTDE_ITEM_FATUR', 
            'VALOR_UNITARIO', 'VALOR_FATURADO', 'DATA_EMISSAO', 'ANO', 'MES', 
            'DESCRICAO_ITEM', 'LINHA_PRODUTO', 'GRUPO_ESTRUTURA',
            "FATU_060.CH_IT_NF_NUM_NFIS||'.'||FATU_060.SEQ_ITEM_NFISC||'.'||FATU_050.CGC_9"
        ];
        
        // Check for missing columns against the cleaned headers.
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
            return reject(new Error(`Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}`));
        }
        
        if (dataRows.length === 0) {
            return reject(new Error('A planilha não contém dados (apenas cabeçalho).'));
        }

        // Re-create the array of objects using cleaned headers.
        const jsonData = dataRows.map(row => {
            const obj: { [key: string]: any } = {};
            headers.forEach((header, i) => {
                if (header) { // Only add keys for non-empty headers
                    obj[header] = row[i];
                }
            });
            return obj;
        });

        const parsedData: BillingRecord[] = jsonData.map((row, index) => {
            if (!row["FATU_060.CH_IT_NF_NUM_NFIS||'.'||FATU_060.SEQ_ITEM_NFISC||'.'||FATU_050.CGC_9"]) {
               console.warn(`ID Faltando na linha ${index + 2}. Pulando registro.`);
               return null;
            }
            return {
                id: row["FATU_060.CH_IT_NF_NUM_NFIS||'.'||FATU_060.SEQ_ITEM_NFISC||'.'||FATU_050.CGC_9"],
                customerName: row.NOME_CLIENTE || 'N/A',
                invoiceId: Number(row.CH_IT_NF_NUM_NFIS) || 0,
                quantity: Number(row.QTDE_ITEM_FATUR) || 0,
                unitPrice: Number(row.VALOR_UNITARIO) || 0,
                totalValue: Number(row.VALOR_FATURADO) || 0,
                issueDate: excelSerialDateToJSDate(row.DATA_EMISSAO),
                year: Number(row.ANO) || 0,
                month: Number(row.MES) || 0,
                productDescription: row.DESCRICAO_ITEM || 'N/A',
                productLine: String(row.LINHA_PRODUTO) || 'N/A',
                productGroup: row.GRUPO_ESTRUTURA || 'N/A',
            };
        }).filter((record): record is BillingRecord => record !== null);

        resolve(parsedData);
      } catch (error) {
        console.error("Erro ao processar o arquivo XLSX:", error);
        if(error instanceof Error) {
            reject(new Error(`Erro ao processar o arquivo: ${error.message}`));
        } else {
            reject(new Error('Ocorreu um erro desconhecido ao processar o arquivo.'));
        }
      }
    };

    reader.onerror = () => {
        reject(new Error('Falha ao ler o arquivo.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
