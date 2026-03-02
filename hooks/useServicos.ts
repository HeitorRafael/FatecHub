'use client';

import { useState, useEffect } from 'react';
import { Servico, CreateServicoRequest, UpdateServicoRequest } from '@/types';

export function useServicos() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch serviços da empresa
    const fetchServicos = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Não autenticado');
                return;
            }

            const response = await fetch('/api/servicos', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar serviços');
            }

            const data = await response.json();
            setServicos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao buscar serviços');
        } finally {
            setLoading(false);
        }
    };

    // Criar novo serviço
    const criarServico = async (data: CreateServicoRequest): Promise<Servico | null> => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Não autenticado');
                return null;
            }

            const response = await fetch('/api/servicos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar serviço');
            }

            const novoServico = await response.json();
            setServicos([novoServico, ...servicos]);
            return novoServico;
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao criar serviço';
            setError(mensagem);
            return null;
        }
    };

    // Editar serviço
    const editarServico = async (id: string, data: UpdateServicoRequest): Promise<Servico | null> => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Não autenticado');
                return null;
            }

            const response = await fetch(`/api/servicos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao editar serviço');
            }

            const servicoAtualizado = await response.json();
            setServicos(servicos.map(s => s.id === id ? servicoAtualizado : s));
            return servicoAtualizado;
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao editar serviço';
            setError(mensagem);
            return null;
        }
    };

    // Deletar serviço
    const deletarServico = async (id: string): Promise<boolean> => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Não autenticado');
                return false;
            }

            const response = await fetch(`/api/servicos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao deletar serviço');
            }

            setServicos(servicos.filter(s => s.id !== id));
            return true;
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao deletar serviço';
            setError(mensagem);
            return false;
        }
    };

    // Fetch inicial
    useEffect(() => {
        fetchServicos();
    }, []);

    return {
        servicos,
        loading,
        error,
        fetchServicos,
        criarServico,
        editarServico,
        deletarServico,
        setError,
    };
}
