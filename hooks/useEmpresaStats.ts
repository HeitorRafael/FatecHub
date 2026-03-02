'use client';

import { useState, useEffect } from 'react';

interface EmpresaStats {
    vagasAbertas: number;
    candidaturas: number;
    emAndamento: number;
    concluidos: number;
}

export function useEmpresaStats() {
    const [stats, setStats] = useState<EmpresaStats>({
        vagasAbertas: 0,
        candidaturas: 0,
        emAndamento: 0,
        concluidos: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Não autenticado');
                    return;
                }

                const response = await fetch('/api/dashboard/empresa/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar estatísticas');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao buscar estatísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
}
