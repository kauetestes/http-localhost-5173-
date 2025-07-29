
import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import { parseXlsmFile } from './utils/fileParser';
import { BillingRecord } from './types';
import { AlertTriangleIcon } from './components/icons';

const App: React.FC = () => {
    const [billingData, setBillingData] = useState<BillingRecord[] | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileUpload = useCallback(async (file: File) => {
        setIsParsing(true);
        setError(null);
        try {
            const data = await parseXlsmFile(file);
            setBillingData(data);
            setFileName(file.name);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
            setBillingData(null);
        } finally {
            setIsParsing(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        setBillingData(null);
        setError(null);
        setFileName('');
    }, []);
    
    const renderContent = () => {
        if (billingData) {
            return <Dashboard data={billingData} onReset={handleReset} fileName={fileName} />;
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                <h1 className="text-3xl font-bold text-white mb-2">Importar Dados de Faturamento</h1>
                <p className="text-slate-400 mb-8">Selecione um arquivo .xlsm para começar</p>
                
                <FileUpload onFileUpload={handleFileUpload} isParsing={isParsing} />

                {error && (
                    <div className="mt-6 flex items-center bg-red-900/50 border border-red-500 text-red-300 text-sm font-medium px-4 py-3 rounded-lg" role="alert">
                        <AlertTriangleIcon />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-base-darker text-base-content font-sans">
            <div className="container mx-auto">
                {renderContent()}
            </div>
        </main>
    );
};

export default App;
