'use client';

import { useState, useEffect } from 'react';

interface AdminStats {
    totalEstudantes: number;
    totalEmpresas: number;
    servicosAtivos: number;
    contratosConcluidos: number;
}

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats>({
        totalEstudantes: 0,
        totalEmpresas: 0,
        servicosAtivos: 0,
        contratosConcluidos: 0,
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

                const response = await fetch('/api/dashboard/admin/stats', {
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
