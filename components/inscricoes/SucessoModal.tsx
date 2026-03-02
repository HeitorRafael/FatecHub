'use client';

interface SucessoModalProps {
    isOpen: boolean;
    servicoTitulo: string;
    onClose: () => void;
}

export default function SucessoModal({
    isOpen,
    servicoTitulo,
    onClose,
}: SucessoModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 border-b-4 border-green-700 px-6 py-4">
                    <h2 className="text-xl font-black text-white">✨ Sucesso!</h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-center">
                    <div className="text-5xl mb-4">🎉</div>

                    <div>
                        <p className="text-gray-700 text-sm mb-2">Você se candidatou com sucesso para:</p>
                        <p className="text-xl font-bold text-gray-900">{servicoTitulo}</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                        <p className="font-semibold mb-2">Próximos passos:</p>
                        <ul className="text-left space-y-1">
                            <li>✓ Sua candidatura foi registrada</li>
                            <li>✓ A empresa será notificada</li>
                            <li>✓ Você receberá atualizações</li>
                        </ul>
                    </div>

                    {/* Button */}
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
