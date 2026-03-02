'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types';

export default function AdminDashboard() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Aqui você buscaria o usuário do servidor
        // Por enquanto, vamos verificar se há um token
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/');
            } else {
                setLoading(false);
            }
        }
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('authToken');
        router.push('/');
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-8">FatecHub Admin</h2>
                <nav className="space-y-4">
                    <a href="#" className="block px-4 py-2 rounded bg-blue-600">Dashboard</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Alunos</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Empresas</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Serviços</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Feedbacks</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Admins</a>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-8 w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold mb-8">Dashboard do Administrador</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Total de Alunos</h3>
                        <p className="text-4xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Total de Empresas</h3>
                        <p className="text-4xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Serviços Ativos</h3>
                        <p className="text-4xl font-bold text-purple-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Contratos Finalizados</h3>
                        <p className="text-4xl font-bold text-orange-600">0</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Alunos Mais Ativos (Este Mês)</h2>
                        <p className="text-gray-500">Nenhum acesso registrado</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Alunos Inativos</h2>
                        <p className="text-gray-500">Nenhum aluno inativo</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
