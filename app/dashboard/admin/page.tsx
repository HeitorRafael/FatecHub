'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types';

export default function AdminDashboard() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');

            if (!token) {
                router.push('/');
            } else {
                if (userData) {
                    try {
                        const parsedUser = JSON.parse(userData);
                        setUser(parsedUser);
                    } catch (error) {
                        console.error('Erro ao parsear dados do usuário:', error);
                    }
                }
                setLoading(false);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-900 font-semibold">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-red-600 border-b-4 border-red-700 shadow-lg sticky top-0 z-50">
                <div className="max-w-full mx-auto px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white">FatecHub</h1>
                            <p className="text-xs text-red-100 font-semibold mt-1">Painel Administrativo</p>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-bold text-white">{user.nome}</p>
                                        <p className="text-xs text-red-100 font-semibold">Administrador</p>
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white font-bold border-2 border-red-600 shadow-md">
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
                                className="px-6 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-black active:scale-95 transition font-semibold text-sm shadow-md border-4 border-gray-700 hover:border-gray-600 cursor-pointer"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-900 text-white shadow-xl hidden md:flex flex-col">
                    <nav className="p-6 space-y-2 flex-1">
                        <div className="mb-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Principal</p>
                        </div>

                        <a href="#" className="block px-4 py-3 rounded-lg bg-red-600 font-semibold text-white transition hover:bg-red-700">
                            📊 Dashboard
                        </a>
                        <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 transition font-semibold">
                            👥 Alunos
                        </a>
                        <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 transition font-semibold">
                            🏢 Empresas
                        </a>
                        <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 transition font-semibold">
                            💼 Serviços
                        </a>
                        <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 transition font-semibold">
                            ⭐ Feedbacks
                        </a>
                        <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 transition font-semibold">
                            🔑 Administradores
                        </a>
                    </nav>

                    <div className="p-6 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6 lg:p-8">
                        {/* Welcome */}
                        <div className="mb-8">
                            <h2 className="text-4xl font-black text-gray-900 mb-3">Bem-vindo, Administrador</h2>
                            <div className="h-1 w-24 bg-red-600 rounded-full"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total de Alunos</p>
                                        <p className="text-4xl font-black text-gray-900 mt-2">0</p>
                                    </div>
                                    <div className="text-4xl">👥</div>
                                </div>
                                <div className="h-1 w-12 bg-red-600 rounded-full"></div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md border-l-4 border-gray-900 p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total de Empresas</p>
                                        <p className="text-4xl font-black text-gray-900 mt-2">0</p>
                                    </div>
                                    <div className="text-4xl">🏢</div>
                                </div>
                                <div className="h-1 w-12 bg-gray-900 rounded-full"></div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Serviços Ativos</p>
                                        <p className="text-4xl font-black text-gray-900 mt-2">0</p>
                                    </div>
                                    <div className="text-4xl">💼</div>
                                </div>
                                <div className="h-1 w-12 bg-red-600 rounded-full"></div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md border-l-4 border-gray-900 p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Contratos Finalizados</p>
                                        <p className="text-4xl font-black text-gray-900 mt-2">0</p>
                                    </div>
                                    <div className="text-4xl">✅</div>
                                </div>
                                <div className="h-1 w-12 bg-gray-900 rounded-full"></div>
                            </div>
                        </div>

                        {/* Analytics Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-600">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                    <h3 className="text-xl font-black text-gray-900">Alunos Mais Ativos (Este Mês)</h3>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-gray-500 text-center py-8 font-medium">Nenhum acesso registrado</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-gray-900">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                                    <h3 className="text-xl font-black text-gray-900">Alunos Inativos</h3>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-gray-500 text-center py-8 font-medium">Nenhum aluno inativo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
