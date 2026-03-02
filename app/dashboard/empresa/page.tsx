'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types';

export default function EmpresaDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">FatecHub</h1>
            
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {user && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col items-end">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 truncate">
                      {user.nome}
                    </p>
                    <p className="text-xs text-gray-500">Empresa</p>
                  </div>
                  
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
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
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white text-xs sm:text-sm rounded hover:bg-red-700 transition whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
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
