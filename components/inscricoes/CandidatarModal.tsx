'use client';

import { useState, useEffect } from 'react';
import Portal from '@/components/Portal';

interface CandidatarModalProps {
    isOpen: boolean;
    servicoTitulo: string;
    empresaNome: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
}

export default function CandidatarModal({
    isOpen,
    servicoTitulo,
    empresaNome,
    onClose,
    onConfirm,
    isLoading = false,
}: CandidatarModalProps) {
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        console.log('CandidatarModal isOpen:', isOpen, 'titulo:', servicoTitulo);
    }, [isOpen, servicoTitulo]);

    const handleConfirm = async () => {
        console.log('❌ BOTÃO CLICADO - handleConfirm início');
        console.log('❌ onConfirm prop:', typeof onConfirm, onConfirm ? 'existe' : 'undefined');
        console.log('❌ isLoading:', isLoading);
        
        if (isLoading) {
            console.log('❌ Já está carregando, ignorando clique');
            return;
        }
        
        setErro(null);
        try {
            console.log('❌ CHAMANDO onConfirm()...');
            const result = await onConfirm();
            console.log('❌ onConfirm() resolvido:', result);
        } catch (err) {
            console.error('❌ ERRO em handleConfirm:', err);
            const message = err instanceof Error ? err.message : 'Erro ao candidatar';
            setErro(message);
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div 
                className="flex items-center justify-center p-4"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 99999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                style={{
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 border-b-4 border-red-700 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black text-white">💼 Candidatar-se?</h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-white text-2xl hover:text-red-100 transition disabled:opacity-50"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {erro && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {erro}
                        </div>
                    )}

                    <div>
                        <p className="text-gray-600 text-sm font-medium mb-3">Você está se candidatando para:</p>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-600">
                            <p className="font-bold text-gray-900 text-lg mb-2">{servicoTitulo}</p>
                            <p className="text-sm text-gray-700">
                                📌 <span className="font-semibold">{empresaNome}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-800 font-medium">
                        ℹ️ Ao candidatar-se, a empresa receberá sua aplicação e poderá entrar em contato com você.
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-300 disabled:opacity-50 transition font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                console.log('🔴 CLIQUE DETECTADO NO BOTÃO');
                                handleConfirm();
                            }}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
                        >
                            {isLoading ? 'Candidatando...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </Portal>
    );
}
