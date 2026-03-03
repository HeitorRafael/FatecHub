import { useState, useCallback, useEffect } from 'react';

export interface Inscricao {
    id: string;
    estudanteId: string;
    servicoId: string;
    status: 'PENDENTE' | 'ACEITO' | 'REJEITADO' | 'CANCELADO';
    criadoEm: Date | string;
    atualizadoEm: Date | string;
    servico: {
        id: string;
        titulo: string;
        tipo: string;
        descricao: string;
        empresa: {
            id: string;
            nomeEmpresa: string;
        };
    };
}

export function useInscricoes() {
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch inscrições do estudante
    const fetchInscricoes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch('/api/inscricoes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar inscrições');
            }

            const data: Inscricao[] = await response.json();
            setInscricoes(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao buscar inscrições';
            setError(message);
            setInscricoes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Candidatar a um serviço
    const candidatar = useCallback(async (servicoId: string) => {
        console.log('useInscricoes.candidatar chamado com servicoId:', servicoId);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            console.log('Token obtido:', !!token);
            if (!token) {
                throw new Error('Token não encontrado');
            }

            console.log('Enviando POST para /api/inscricoes');
            const response = await fetch('/api/inscricoes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ servicoId }),
            });

            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Erro da API:', errorData);
                throw new Error(errorData.error || 'Erro ao candidatar');
            }

            const novaInscricao: Inscricao = await response.json();
            console.log('Inscrição criada:', novaInscricao);
            setInscricoes(prev => [novaInscricao, ...prev]);
            return novaInscricao;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao candidatar';
            console.error('Erro em candidatar:', message);
            setError(message);
            throw err;
        }
    }, []);

    // Cancelar inscrição
    const cancelarInscricao = useCallback(async (inscricaoId: string) => {
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`/api/inscricoes/${inscricaoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao cancelar inscrição');
            }

            setInscricoes(prev => prev.filter(i => i.id !== inscricaoId));
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao cancelar inscrição';
            setError(message);
            throw err;
        }
    }, []);

    // Verificar se já se candidatou a um serviço
    const jaSeCandidata = useCallback((servicoId: string) => {
        return inscricoes.some(i => i.servicoId === servicoId);
    }, [inscricoes]);

    // Auto-fetch ao montar componente
    useEffect(() => {
        fetchInscricoes();
    }, [fetchInscricoes]);

    return {
        inscricoes,
        loading,
        error,
        fetchInscricoes,
        candidatar,
        cancelarInscricao,
        jaSeCandidata,
    };
}
