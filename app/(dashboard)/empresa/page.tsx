'use client';

import { useRouter } from 'next/navigation';

export default function EmpresaDashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('authToken');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">FatecHub - Empresa</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-8">
                <h2 className="text-3xl font-bold mb-8">Bem-vindo ao Painel da Empresa</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold mb-4">Serviços Ativos</h3>
                        <p className="text-gray-500">Nenhum serviço cadastrado</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold mb-4">Contratos Finalizados</h3>
                        <p className="text-gray-500">Nenhum contrato finalizado</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">Criar Novo Serviço</h3>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            + Novo Serviço
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
