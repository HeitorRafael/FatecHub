'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, CreateServicoRequest, Servico, UpdateServicoRequest } from '@/types';
import { useEmpresaStats } from '@/hooks/useEmpresaStats';
import { useServicos } from '@/hooks/useServicos';
import CreateServicoModal from '@/components/servicos/CreateServicoModal';
import EditServicoModal from '@/components/servicos/EditServicoModal';
import DeleteServicoModal from '@/components/servicos/DeleteServicoModal';

export default function EmpresaDashboard() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { stats } = useEmpresaStats();
    const { servicos, loading: servicosLoading, criarServico: criarServicoHook, editarServico: editarServicoHook, deletarServico: deletarServicoHook } = useServicos();

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

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
    };

    const handleCreateServico = async (data: CreateServicoRequest) => {
        setIsCreating(true);
        try {
            await criarServicoHook(data);
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditServico = async (id: string, data: UpdateServicoRequest) => {
        setIsEditing(true);
        try {
            await editarServicoHook(id, data);
            setIsEditModalOpen(false);
            setServicoSelecionado(null);
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteServico = async (id: string) => {
        setIsDeleting(true);
        try {
            await deletarServicoHook(id);
            setIsDeleteModalOpen(false);
            setServicoSelecionado(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const openEditModal = (servico: Servico) => {
        setServicoSelecionado(servico);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (servico: Servico) => {
        setServicoSelecionado(servico);
        setIsDeleteModalOpen(true);
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modals */}
            <CreateServicoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateServico}
                isLoading={isCreating}
            />
            <EditServicoModal
                isOpen={isEditModalOpen}
                servico={servicoSelecionado}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setServicoSelecionado(null);
                }}
                onSubmit={handleEditServico}
                isLoading={isEditing}
            />
            <DeleteServicoModal
                isOpen={isDeleteModalOpen}
                servico={servicoSelecionado}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setServicoSelecionado(null);
                }}
                onConfirm={handleDeleteServico}
                isLoading={isDeleting}
            />

            {/* Header */}
            <nav className="bg-red-600 border-b-4 border-red-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white">FatecHub</h1>
                            <p className="text-xs text-red-100 font-semibold mt-1">Painel Empresarial</p>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                            {user && (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex flex-col items-end">
                                        <p className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                                            {user.nome}
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
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Painel da Empresa</h2>
                    <div className="h-1 w-20 bg-red-600 rounded-full"></div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Serviços Ativos */}
                    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border-t-4 border-red-600 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">Serviços Ativos</h3>
                        </div>
                        <p className="text-gray-500 font-medium mb-4">I{stats.vagasAbertas} serviço(s) ativo(s)</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
                        >
                            + Novo Serviço
                        </button>
                    </div>

                    {/* Contratos Finalizados */}
                    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border-t-4 border-gray-900 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">Contratos Finalizados</h3>
                        </div>
                        <p className="text-gray-500 font-medium">{stats.concluidos} contrato(s) finalizado(s)</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-600">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Vagas Abertas</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.vagasAbertas}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Candidaturas</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.candidaturas}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-600">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Em Andamento</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.emAndamento}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
                        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Concluídos</p>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">{stats.concluidos}</p>
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="bg-white rounded-xl p-6 sm:p-12 text-center shadow-lg border-2 border-red-600 mb-8">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Conecte-se com os Melhores Talentos</h3>
                    <p className="text-gray-900 font-semibold text-lg mb-6">Poste seus serviços e receba candidaturas de alunos qualificados da FATEC</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 sm:px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold shadow-lg"
                    >
                        Postar Novo Serviço
                    </button>
                </div>

                {/* Serviços List */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                            <h3 className="text-2xl font-black text-gray-900">Meus Serviços</h3>
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                {servicos.length}
                            </span>
                        </div>
                    </div>

                    {servicosLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 font-medium">Carregando serviços...</p>
                        </div>
                    ) : servicos.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center border-l-4 border-gray-400">
                            <p className="text-gray-500 font-medium mb-4">Você ainda não criou nenhum serviço</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold inline-block"
                            >
                                Criar Primeiro Serviço
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {servicos.map((servico: Servico) => (
                                <div
                                    key={servico.id}
                                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition"
                                >
                                    {servico.imagemUrl && (
                                        <img
                                            src={servico.imagemUrl}
                                            alt={servico.titulo}
                                            className="w-full h-32 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h4 className="text-lg font-black text-gray-900 mb-2">{servico.titulo}</h4>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{servico.descricao}</p>

                                    <div className="space-y-1 mb-4 text-sm text-gray-600">
                                        <p>📦 <span className="font-semibold">{servico.tipo}</span></p>
                                        <p>⏱️ <span className="font-semibold">{servico.duracao} semanas</span></p>
                                        <p>💰 <span className="font-semibold">{servico.faixaPreco}</span></p>
                                        <p>📅 {formatarData(servico.dataInicio)} - {formatarData(servico.dataFim)}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(servico)}
                                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-semibold">
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(servico)}
                                            className="flex-1 px-3 py-2 bg-red-200 text-red-700 text-sm rounded-lg hover:bg-red-300 transition font-semibold">
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
