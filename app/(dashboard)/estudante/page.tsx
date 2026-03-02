'use client';

import { useRouter } from 'next/navigation';

export default function EstudanteDashboard() {
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
                    <h1 className="text-2xl font-bold text-gray-800">FatecHub - Estudante</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-8">
                <h2 className="text-3xl font-bold mb-8">Bem-vindo ao Dashboard do Estudante</h2>

                {/* Carrossel de Oportunidades */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Oportunidades Disponíveis</h3>
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        Nenhuma oportunidade disponível no momento
                    </div>
                </div>

                {/* Mensagens de Inspiração */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 text-center">
                        <p className="text-lg">
                            💡 "Não menospreze as oportunidades oferecidas. Construir seu portfólio é essencial para sua carreira!"
                        </p>
                    </div>
                </div>

                {/* Tipos de Serviço */}
                <div>
                    <h3 className="text-2xl font-bold mb-4">Tipos de Serviço</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            'Design',
                            'Desenvolvimento',
                            'Consultoria',
                            'Marketing',
                            'Outras'
                        ].map((tipo) => (
                            <button key={tipo} className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg hover:bg-gray-50 transition">
                                {tipo}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
