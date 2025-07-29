
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './icons';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
    isParsing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isParsing }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`w-full max-w-lg p-8 text-center border-2 border-dashed rounded-xl cursor-pointer
                ${isDragging ? 'border-brand-secondary bg-slate-800' : 'border-slate-700 bg-slate-900/50'}
                transition-colors duration-300
            `}
        >
            <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".xlsm, application/vnd.ms-excel.sheet.macroEnabled.12"
                onChange={handleFileChange}
                disabled={isParsing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                    <div className="flex justify-center items-center h-16 w-16">
                      {isParsing ? (
                         <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-brand-secondary"></div>
                      ) : (
                         <UploadCloudIcon />
                      )}
                    </div>

                    <p className="mt-4 text-lg font-semibold text-white">
                        {isParsing ? 'Processando arquivo...' : 'Arraste e solte o arquivo aqui'}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                        ou clique para selecionar
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        Apenas arquivos .xlsm
                    </p>
                </div>
            </label>
        </div>
    );
};

export default FileUpload;
