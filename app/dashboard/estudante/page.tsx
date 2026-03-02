'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types';
import { useEstudanteStats } from '@/hooks/useEstudanteStats';
import { useServicosBrowse } from '@/hooks/useServicosBrowse';
import { useInscricoes } from '@/hooks/useInscricoes';
import CandidatarModal from '@/components/inscricoes/CandidatarModal';
import SucessoModal from '@/components/inscricoes/SucessoModal';

export default function EstudanteDashboard() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [filters, setFilters] = useState({
        tipo: '',
        faixaPreco: '',
        duracao: '',
        search: '',
    });
    const [page, setPage] = useState(1);
    const [candidaturaSelecionada, setCandidaturaSelecionada] = useState<any>(null);
    const [isCandidatarModalOpen, setIsCandidatarModalOpen] = useState(false);
    const [isSucessoModalOpen, setIsSucessoModalOpen] = useState(false);
    const [isCandidating, setIsCandidating] = useState(false);
    const router = useRouter();
    const { stats, loading: statsLoading } = useEstudanteStats();
    const { servicos, pagination, loading: servicosLoading, fetchServicos } = useServicosBrowse();
    const { candidatar, jaSeCandidata } = useInscricoes();

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
                } catch (error) {
                    console.error('Erro ao parsear dados do usuário:', error);
                }
            }
        }
    }, [router]);

    // Fetch serviços quando filtros ou página mudam
    useEffect(() => {
        fetchServicos({
            tipo: filters.tipo || undefined,
            faixaPreco: filters.faixaPreco || undefined,
            duracao: filters.duracao || undefined,
            search: filters.search || undefined,
            page,
            limit: 12,
        });
    }, [filters, page, fetchServicos]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
    };

    const getInitials = (nome: string) => {
        return nome
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatarData = (data: Date | string) => {
        const date = typeof data === 'string' ? new Date(data) : data;
        return date.toLocaleDateString('pt-BR');
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
        setPage(1); // Reset página ao filtrar
    };

    const handleSearchChange = (value: string) => {
        handleFilterChange('search', value);
    };

    const handleOpenCandidatarModal = (servico: any) => {
        setCandidaturaSelecionada(servico);
        setIsCandidatarModalOpen(true);
    };

    const handleConfirmCandidatura = async () => {
        if (!candidaturaSelecionada) return;

        setIsCandidating(true);
        try {
            await candidatar(candidaturaSelecionada.id);
            setIsCandidatarModalOpen(false);
            setIsSucessoModalOpen(true);
        } catch (err) {
            console.error('Erro ao candidatar:', err);
            // Modal de erro é mostrado dentro do CandidatarModal
        } finally {
            setIsCandidating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modals */}
            <CandidatarModal
                isOpen={isCandidatarModalOpen}
                servicoTitulo={candidaturaSelecionada?.titulo || ''}
                empresaNome={candidaturaSelecionada?.empresa?.nomeEmpresa || ''}
                onClose={() => {
                    setIsCandidatarModalOpen(false);
                    setCandidaturaSelecionada(null);
                }}
                onConfirm={handleConfirmCandidatura}
                isLoading={isCandidating}
            />
            <SucessoModal
                isOpen={isSucessoModalOpen}
                servicoTitulo={candidaturaSelecionada?.titulo || ''}
                onClose={() => {
                    setIsSucessoModalOpen(false);
                    setCandidaturaSelecionada(null);
                }}
            />

            {/* Header Sofisticado */}
            <nav className="bg-red-600 border-b-4 border-red-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white">FatecHub</h1>
                            <p className="text-xs text-red-100 font-semibold mt-1">Portal do Estudante</p>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                            {user && (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex flex-col items-end">
                                        <p className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                                            {user.nome}
                                        </p>
                                        <p className="text-xs text-red-100 font-semibold">Estudante</p>
                                    </div>

                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 border-2 border-gray-200 shadow-md">
                                        {user.foto ? (
                                            <img
                                                src={user.foto}
                                                alt={user.nome}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            getInitials(user.nome)
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Bem-vindo ao Dashboard</h2>
                    <div className="h-1 w-20 bg-red-600 rounded-full"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-600">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Oportunidades</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.oportunidadesDisponíveis}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Minhas Aplicações</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.minhasAplicacoes}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-600">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Contratos Ativos</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.contratosAtivos}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Concluídos</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.concluidos}</p>
                    </div>
                </div>

                {/* Oportunidades */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                        <h3 className="text-2xl font-black text-gray-900">Buscar Oportunidades</h3>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-red-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Busca por texto */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Buscar</label>
                                <input
                                    type="text"
                                    placeholder="Título ou descrição..."
                                    value={filters.search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                                />
                            </div>

                            {/* Filtro por Tipo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Tipo</label>
                                <select
                                    value={filters.tipo}
                                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                                >
                                    <option value="">Todos os tipos</option>
                                    <option value="DESIGN">🎨 Design</option>
                                    <option value="DESENVOLVIMENTO">💻 Desenvolvimento</option>
                                    <option value="CONSULTORIA">💼 Consultoria</option>
                                    <option value="MARKETING">📢 Marketing</option>
                                    <option value="GESTAO_PROJETOS">📊 Gestão de Projetos</option>
                                    <option value="ANALISE_DADOS">📈 Análise de Dados</option>
                                    <option value="TRADUCAO">🌐 Tradução</option>
                                    <option value="REDACAO">✍️ Redação</option>
                                    <option value="TUTORIA">👨‍🏫 Tutoria</option>
                                    <option value="OUTRO">⭐ Outro</option>
                                </select>
                            </div>

                            {/* Filtro por Preço */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Faixa de Preço</label>
                                <select
                                    value={filters.faixaPreco}
                                    onChange={(e) => handleFilterChange('faixaPreco', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                                >
                                    <option value="">Todas as faixas</option>
                                    <option value="VINTE_CINQUENTA">R$ 20 - R$ 50</option>
                                    <option value="CINQUENTA_CEM">R$ 50 - R$ 100</option>
                                    <option value="CEM_DUZENTOS">R$ 100 - R$ 200</option>
                                    <option value="DUZENTOS_QUINHENTOS">R$ 200 - R$ 500</option>
                                    <option value="QUINHENTOS_MIL">R$ 500 - R$ 1.000</option>
                                </select>
                            </div>

                            {/* Filtro por Duração */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Duração</label>
                                <select
                                    value={filters.duracao}
                                    onChange={(e) => handleFilterChange('duracao', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                                >
                                    <option value="">Qualquer duração</option>
                                    <option value="1">1 semana</option>
                                    <option value="2">2 semanas</option>
                                    <option value="3">3 semanas</option>
                                    <option value="4">4 semanas</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Serviços */}
                    {servicosLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 font-medium">Carregando oportunidades...</p>
                        </div>
                    ) : servicos.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center border-l-4 border-gray-400">
                            <p className="text-gray-500 font-medium">Nenhuma oportunidade encontrada com esses filtros</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {servicos.map((servico) => (
                                    <div
                                        key={servico.id}
                                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition flex flex-col"
                                    >
                                        {/* Imagem */}
                                        {servico.imagemUrl && (
                                            <img
                                                src={servico.imagemUrl}
                                                alt={servico.titulo}
                                                className="w-full h-32 object-cover rounded-lg mb-4"
                                            />
                                        )}

                                        {/* Info da Empresa */}
                                        <div className="mb-3 pb-3 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-700">{servico.empresa.nomeEmpresa}</p>
                                            {servico.empresa.localizacao && (
                                                <p className="text-xs text-gray-500">📍 {servico.empresa.localizacao}</p>
                                            )}
                                        </div>

                                        {/* Título e Descrição */}
                                        <h4 className="text-lg font-black text-gray-900 mb-2">{servico.titulo}</h4>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{servico.descricao}</p>

                                        {/* Detalhes */}
                                        <div className="space-y-1 mb-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
                                            <p>📦 <span className="font-semibold">{servico.tipo}</span></p>
                                            <p>⏱️ <span className="font-semibold">{servico.duracao} semana{servico.duracao !== 1 ? 's' : ''}</span></p>
                                            <p>💰 <span className="font-semibold">{servico.faixaPreco}</span></p>
                                            <p>📅 {formatarData(servico.dataInicio)} - {formatarData(servico.dataFim)}</p>
                                            {servico._count.inscricoes > 0 && (
                                                <p>👥 <span className="font-semibold">{servico._count.inscricoes} candidato{servico._count.inscricoes !== 1 ? 's' : ''}</span></p>
                                            )}
                                        </div>

                                        {/* Botão */}
                                        <button
                                            onClick={() => handleOpenCandidatarModal(servico)}
                                            disabled={jaSeCandidata(servico.id)}
                                            className={`w-full px-4 py-2 rounded-lg transition font-semibold ${
                                                jaSeCandidata(servico.id)
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {jaSeCandidata(servico.id) ? '✓ Já se candidatou' : 'Candidatar-se'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Paginação */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                                    >
                                        ← Anterior
                                    </button>
                                    <span className="px-4 py-2 bg-white rounded-lg border-2 border-gray-400 font-semibold text-gray-900">
                                        Página {pagination.page} de {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                                        disabled={page === pagination.pages}
                                        className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                                    >
                                        Próxima →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Inspiração Banner */}
                <div>
                    <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-lg border-2 border-red-600">
                        <p className="text-lg sm:text-xl text-gray-900 font-semibold leading-relaxed">
                            💡 <span className="text-red-600">Não menospreze as oportunidades</span> oferecidas. Construir seu portfólio é essencial para sua carreira profissional!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
