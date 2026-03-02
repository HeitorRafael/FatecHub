'use client';

import { useState, useEffect } from 'react';

interface EstudanteStats {
    oportunidadesDisponíveis: number;
    minhasAplicacoes: number;
    contratosAtivos: number;
    concluidos: number;
}

export function useEstudanteStats() {
    const [stats, setStats] = useState<EstudanteStats>({
        oportunidadesDisponíveis: 0,
        minhasAplicacoes: 0,
        contratosAtivos: 0,
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

                const response = await fetch('/api/dashboard/estudante/stats', {
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
