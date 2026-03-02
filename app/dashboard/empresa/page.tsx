'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types';
import { useEmpresaStats } from '@/hooks/useEmpresaStats';

export default function EmpresaDashboard() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const router = useRouter();
    const { stats, loading: statsLoading } = useEmpresaStats();

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

    const getInitials = (nome: string) => {
        return nome
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Sofisticado */}
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
                        <p className="text-gray-500 font-medium mb-4">Nenhum serviço cadastrado</p>
                        <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md">
                            + Novo Serviço
                        </button>
                    </div>

                    {/* Contratos Finalizados */}
                    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border-t-4 border-gray-900 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">Contratos Finalizados</h3>
                        </div>
                        <p className="text-gray-500 font-medium">Nenhum contrato finalizado</p>
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
                <div className="bg-white rounded-xl p-6 sm:p-12 text-center shadow-lg border-2 border-red-600">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Comece a Postar Oportunidades</h3>
                    <p className="text-gray-900 font-semibold text-lg mb-6">Conecte sua empresa com os melhores talentos da FATEC</p>
                    <button className="px-6 sm:px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold shadow-lg">
                        Criar Nova Oportunidade
                    </button>
                </div>
            </div>
        </div>
    );
}
