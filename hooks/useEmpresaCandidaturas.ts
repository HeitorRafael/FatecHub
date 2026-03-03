'use client';

import { useState, useCallback, useEffect } from 'react';

interface Estudante {
    id: string;
    user: {
        nome: string;
        email: string;
        foto: string | null;
    };
    ra: string;
    curso: string;
    mestre: string;
    pontuacao: number;
}

interface Inscricao {
    id: string;
    servicoId: string;
    estudanteId: string;
    estudante: Estudante;
    dataInscricao: string;
    horaInscricao: string;
    criadoEm: string;
}

interface Servico {
    id: string;
    titulo: string;
    tipo: string;
    descricao: string;
    faixaPreco: string;
    duracao: number;
    status: string;
    inscricoes: Inscricao[];
    _count: {
        inscricoes: number;
    };
}

interface EmpresaCandidaturasResponse {
    empresa: {
        id: string;
        nomeEmpresa: string;
    };
    servicos: Servico[];
    totalCandidaturas: number;
    dataAtualizacao: string;
}

export function useEmpresaCandidaturas() {
    const [data, setData] = useState<EmpresaCandidaturasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidaturas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch('/api/empresas/candidaturas', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar candidaturas');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(message);
            console.error('Erro em fetchCandidaturas:', message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidaturas();
        // Atualizar a cada 5 segundos para mostrar candidaturas em tempo real
        const interval = setInterval(fetchCandidaturas, 5000);
        return () => clearInterval(interval);
    }, [fetchCandidaturas]);

    return {
        data,
        loading,
        error,
        refetch: fetchCandidaturas,
    };
}
