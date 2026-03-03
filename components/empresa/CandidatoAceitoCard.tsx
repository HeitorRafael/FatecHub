'use client';

interface Estudante {
    id: string;
    user: {
        nome: string;
        email: string;
        foto: string | null;
    };
    ra: string;
    curso: string;
    mestre: string;
    pontuacao: number;
}

interface CandidatoAceitoCardProps {
    estudante: Estudante;
    servicoTitulo: string;
    onNovosCandidatos: () => void;
}

export default function CandidatoAceitoCard({
    estudante,
    servicoTitulo,
    onNovosCandidatos,
}: CandidatoAceitoCardProps) {
    const getInitials = (nome: string) => {
        return nome
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2);
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border-4 border-green-500 p-8">
            {/* Status: Serviço Fechado */}
            <div className="bg-green-500 text-white rounded-lg p-6 mb-6 text-center border-4 border-green-600 shadow-lg">
                <h1 className="text-4xl font-black mb-2">🎉 SERVIÇO FECHADO!</h1>
                <p className="text-xl font-bold">Match Encontrado com Sucesso</p>
            </div>
            
            {/* Cabeçalho */}
            <div className="text-center mb-6">
                <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full mb-4 font-bold">
                    ✓ CANDIDATO ACEITO
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Serviço: {servicoTitulo}</h2>
                <div className="h-1 w-32 bg-green-500 rounded-full mx-auto"></div>
            </div>

            {/* Dados do Candidato */}
            <div className="bg-white rounded-lg p-8 shadow-md mb-6">
                <div className="flex items-start gap-6 mb-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-2xl border-4 border-green-300 overflow-hidden">
                            {estudante.user.foto ? (
                                <img
                                    src={estudante.user.foto}
                                    alt={estudante.user.nome}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getInitials(estudante.user.nome)
                            )}
                        </div>
                    </div>

                    {/* Informações Principais */}
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 font-semibold">NOME DO CANDIDATO</p>
                        <p className="text-3xl font-black text-gray-900 mb-4">{estudante.user.nome}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">EMAIL</p>
                                <p className="text-lg font-semibold text-gray-900">{estudante.user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">RA</p>
                                <p className="text-lg font-semibold text-gray-900">{estudante.ra}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dados Detalhados */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Curso</p>
                        <p className="text-lg font-bold text-gray-900">{estudante.curso}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Mestre</p>
                        <p className="text-lg font-bold text-gray-900">{estudante.mestre}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Pontuação</p>
                        <p className="text-lg font-bold text-gray-900">⭐ {estudante.pontuacao}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                        <p className="text-lg font-bold text-green-600">✓ Ativo</p>
                    </div>
                </div>
            </div>

            {/* Ações */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 font-semibold mb-2">📞 Próximos Passos:</p>
                <ul className="text-blue-800 text-sm space-y-1">
                    <li>✓ Entre em contato com o candidato via email acima</li>
                    <li>✓ Combine data/hora para início do serviço</li>
                    <li>✓ Acompanhe o progresso na sua dashboard</li>
                </ul>
            </div>

            {/* Botão */}
            <button
                onClick={onNovosCandidatos}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg shadow-md"
            >
                ← Ver Outros Serviços
            </button>
        </div>
    );
}
