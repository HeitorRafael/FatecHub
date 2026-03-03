'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types';
import { useEmpresaCandidaturas } from '@/hooks/useEmpresaCandidaturas';
import CandidatoItem from '@/components/empresa/CandidatoItem';
import CandidatoAceitoCard from '@/components/empresa/CandidatoAceitoCard';

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

export default function EmpresaCandidaturasPage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);
    const [candidatoAceito, setCandidatoAceito] = useState<{
        estudante: Estudante;
        servicoTitulo: string;
    } | null>(null);
    const [isAceitando, setIsAceitando] = useState(false);
    const router = useRouter();
    const { data, loading, error, refetch } = useEmpresaCandidaturas();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');

            if (!token) {
                router.push('/');
            } else if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch (err) {
                    console.error('Erro ao parsear dados do usuário:', err);
                }
            }
        }
    }, [router]);

    const handleLogout = async () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
    };

    const handleAceitarCandidato = async (inscricaoId: string, servicoTitulo: string) => {
        setIsAceitando(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`/api/candidaturas/${inscricaoId}/aceitar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao aceitar candidato');
            }

            const result = await response.json();
            
            // Usar dados do contrato retornado pela API
            if (result.contrato && result.contrato.estudante) {
                setCandidatoAceito({
                    estudante: result.contrato.estudante,
                    servicoTitulo,
                });
            }

            await refetch();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao aceitar candidato';
            alert(`Erro: ${message}`);
            console.error('Erro em handleAceitarCandidato:', message);
        } finally {
            setIsAceitando(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block bg-white rounded-full p-8 shadow-lg">
                        <div className="animate-spin text-red-600">⏳</div>
                    </div>
                    <p className="mt-4 text-gray-600 font-semibold">Carregando candidaturas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-red-600 border-b-4 border-red-700 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-black text-white">FatecHub</h1>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition font-semibold"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg">
                        <p className="font-bold text-lg">Erro ao carregar candidaturas:</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-red-600 border-b-4 border-red-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white">FatecHub</h1>
                            <p className="text-xs text-red-100 font-semibold mt-1">Portal da Empresa</p>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                            {user && (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex flex-col items-end">
                                        <p className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                                            {data?.empresa.nomeEmpresa}
                                        </p>
                                        <p className="text-xs text-red-100 font-semibold">Empresa</p>
                                    </div>

                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 border-2 border-gray-200 shadow-md">
                                        {user.foto ? (
                                            <img
                                                src={user.foto}
                                                alt={user.nome}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            user.nome.split(' ').map(n => n[0]).join('').substring(0, 2)
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleLogout}
                                className="px-6 py-3.5 bg-gray-900 text-white text-xs sm:text-sm rounded-lg hover:bg-black transition font-semibold whitespace-nowrap shadow-md border-4 border-gray-700 hover:border-gray-600 cursor-pointer active:scale-95"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {candidatoAceito ? (
                    // View de candidato aceito
                    <CandidatoAceitoCard
                        estudante={candidatoAceito.estudante}
                        servicoTitulo={candidatoAceito.servicoTitulo}
                        onNovosCandidatos={() => {
                            setCandidatoAceito(null);
                            setServicoSelecionado(null);
                        }}
                    />
                ) : (
                    <>
                        {/* Title Section */}
                        <div className="mb-8">
                            <button
                                onClick={() => router.push('/dashboard/empresa')}
                                className="mb-6 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold text-sm flex items-center gap-2"
                            >
                                ← Voltar
                            </button>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                                        Candidaturas Anônimas
                                    </h2>
                                    <div className="h-1 w-20 bg-red-600 rounded-full"></div>
                                </div>
                                <button
                                    onClick={refetch}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                                >
                                    🔄 Atualizar
                                </button>
                            </div>

                            {/* Info */}
                            <div className="bg-blue-100 border-4 border-blue-700 rounded-lg p-6 mb-6 shadow-lg" style={{backgroundColor: '#DBEAFE', borderColor: '#1E40AF'}}>
                                <p className="font-black text-xl mb-3" style={{color: '#030B1A'}}>ℹ️ Informação importante:</p>
                                <p className="text-lg font-bold" style={{color: '#1E3A8A'}}>
                                    Os candidatos aparecem de forma anônima para evitar preconceitos. Ao clicar em "Aceitar", você terá acesso aos dados completos para contacto.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-600">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Total de Candidatos</p>
                                    <p className="text-3xl sm:text-4xl font-black text-gray-900">{data?.totalCandidaturas || 0}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Serviços Ativos</p>
                                    <p className="text-3xl sm:text-4xl font-black text-gray-900">{data?.servicos.length || 0}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-600">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Atualização</p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                                        {data?.dataAtualizacao ? new Date(data.dataAtualizacao).toLocaleTimeString('pt-BR') : '--:--'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Serviços e Candidaturas */}
                        <div className="space-y-8">
                            {data?.servicos && data.servicos.filter(s => s.inscricoes.length > 0).length > 0 ? (
                                data.servicos
                                    .filter(s => s.inscricoes.length > 0)
                                    .map((servico) => (
                                    <div key={servico.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-t-8 border-red-600">
                                        {/* Serviço Header */}
                                        <div
                                            className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 cursor-pointer hover:from-red-700 hover:to-red-800 transition shadow-md"
                                            onClick={() =>
                                                setServicoSelecionado(
                                                    servicoSelecionado === servico.id ? null : servico.id
                                                )
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-black mb-3" style={{color: '#000000'}}>
                                                        {servico.titulo}
                                                    </h3>
                                                    <div className="flex gap-4 flex-wrap text-sm font-bold">
                                                        <span className="rounded-full px-3 py-1" style={{backgroundColor: '#991B1B', color: '#FFFFFF'}}>
                                                            📌 {servico.tipo}
                                                        </span>
                                                        <span className="rounded-full px-3 py-1" style={{backgroundColor: '#991B1B', color: '#FFFFFF'}}>
                                                            💰 {servico.faixaPreco}
                                                        </span>
                                                        <span className="rounded-full px-3 py-1" style={{backgroundColor: '#991B1B', color: '#FFFFFF'}}>
                                                            📅 {servico.duracao} semanas
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <div className="rounded-lg px-10 py-4 flex flex-col items-center justify-center shadow-md border-2 border-white" style={{backgroundColor: '#991B1B'}}>
                                                        <span className="font-black text-3xl" style={{color: '#FFFFFF'}}>
                                                            {servico.inscricoes.length}
                                                        </span>
                                                        <p className="text-sm font-bold mt-1 text-center" style={{color: '#FFFFFF'}}>candidatos</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Candidatos List */}
                                        <div
                                            className={`transition-all overflow-hidden ${
                                                servicoSelecionado === servico.id
                                                    ? 'max-h-[1000px]'
                                                    : 'max-h-0'
                                            }`}
                                        >
                                            <div className="p-6 space-y-4">
                                                {servico.inscricoes.length > 0 ? (
                                                    servico.inscricoes.map((inscricao) => (
                                                        <CandidatoItem
                                                            key={inscricao.id}
                                                            id={inscricao.id}
                                                            dataInscricao={inscricao.criadoEm}
                                                            horaInscricao={inscricao.horaInscricao}
                                                            onAceitar={() =>
                                                                handleAceitarCandidato(inscricao.id, servico.titulo)
                                                            }
                                                            isLoading={isAceitando}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <p className="text-gray-500 text-lg font-semibold">
                                                            Nenhum candidato ainda
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-8 text-center border-l-4 border-gray-400">
                                    <p className="text-gray-500 text-lg font-semibold">
                                        Nenhum candidato aguardando
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Seus serviços não possuem candidatos pendentes
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
