'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';
import RegisterEstudanteForm from './RegisterEstudanteForm';
import RegisterEmpresaForm from './RegisterEmpresaForm';

type TabType = 'login' | 'register-estudante' | 'register-empresa';

export default function AuthTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('login');
    const router = useRouter();

    const handleLoginSuccess = (role: string) => {
        // Redirecionar baseado no role
        if (role === 'ADMIN') {
            router.push('/dashboard/admin');
        } else if (role === 'ESTUDANTE') {
            router.push('/dashboard/estudante');
        } else if (role === 'EMPRESA') {
            router.push('/dashboard/empresa');
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('login')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'login'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                        }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setActiveTab('register-estudante')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'register-estudante'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                        }`}
                >
                    Estudante
                </button>
                <button
                    onClick={() => setActiveTab('register-empresa')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'register-empresa'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                        }`}
                >
                    Empresa
                </button>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'login' && (
                    <LoginForm onSuccess={handleLoginSuccess} />
                )}
                {activeTab === 'register-estudante' && (
                    <RegisterEstudanteForm onSuccess={handleLoginSuccess} />
                )}
                {activeTab === 'register-empresa' && (
                    <RegisterEmpresaForm onSuccess={handleLoginSuccess} />
                )}
            </div>
        </div>
    );
}
