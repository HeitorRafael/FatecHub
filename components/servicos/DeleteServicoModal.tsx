'use client';

import Portal from '@/components/Portal';
import { Servico } from '@/types';

interface DeleteServicoModalProps {
    isOpen: boolean;
    servico: Servico | null;
    onClose: () => void;
    onConfirm: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export default function DeleteServicoModal({
    isOpen,
    servico,
    onClose,
    onConfirm,
    isLoading = false,
}: DeleteServicoModalProps) {
    const handleConfirm = async () => {
        if (servico) {
            try {
                await onConfirm(servico.id);
                onClose();
            } catch (err) {
                console.error('Erro ao deletar:', err);
            }
        }
    };

    if (!isOpen || !servico) return null;

    return (
        <Portal>
            <div 
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
                    padding: '1rem',
                }}
            >
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                    {/* Header */}
                    <div className="bg-red-600 border-b-4 border-red-700 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-black text-white">Deletar Serviço?</h2>
                            <button
                                onClick={onClose}
                                className="text-white text-2xl hover:text-red-100 transition"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="text-gray-700">
                            <p className="mb-3">
                                Tem certeza que deseja deletar o serviço:
                            </p>
                            <p className="font-bold text-lg text-gray-900 mb-3">
                                "{servico.titulo}"
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                ⚠️ Esta ação é <strong>irreversível</strong>. Se houver candidatos candidatos, eles serão notificados.
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-300 transition font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
                            >
                                {isLoading ? 'Deletando...' : 'Deletar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
