'use client';

interface CandidatoItemProps {
    id: string;
    dataInscricao: string;
    horaInscricao: string;
    onAceitar: (id: string) => void;
    isLoading?: boolean;
}

export default function CandidatoItem({
    id,
    dataInscricao,
    horaInscricao,
    onAceitar,
    isLoading = false,
}: CandidatoItemProps) {
    const dataFormatada = new Date(dataInscricao).toLocaleDateString('pt-BR');

    return (
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 hover:border-red-600 hover:shadow-md transition shadow-sm">
            <div className="flex items-center justify-between">
                {/* Informações Anônimas */}
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        {/* Avatar Anônimo */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white font-black text-2xl border-2 border-gray-600 shadow-md">
                            ?
                        </div>

                        {/* Dados */}
                        <div>
                            <p className="font-black text-lg" style={{color: '#111827'}}>Candidato Anônimo</p>
                            <div className="flex gap-4 mt-2 text-sm">
                                <p className="font-semibold" style={{color: '#374151'}}>📅 {dataFormatada}</p>
                                <p className="font-bold" style={{color: '#374151'}}>⏰ {horaInscricao}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão Aceitar */}
                <button
                    onClick={() => onAceitar(id)}
                    disabled={isLoading}
                    className="ml-4 px-6 py-3 rounded-lg font-bold shadow-md flex-shrink-0 active:scale-95 transition disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: isLoading ? '#9CA3AF' : '#16A34A',
                        color: '#FFFFFF',
                        border: '2px solid #15803D',
                    }}
                >
                    {isLoading ? '✓ Processando...' : '✓ Aceitar'}
                </button>
            </div>
        </div>
    );
}
