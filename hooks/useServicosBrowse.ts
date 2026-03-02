import { useState, useCallback } from 'react';

interface ServicoWithEmpresa {
    id: string;
    empresaId: string;
    titulo: string;
    tipo: string;
    descricao: string;
    faixaPreco: string;
    imagemUrl?: string;
    dataInicio: Date | string;
    dataFim: Date | string;
    duracao: number;
    status: string;
    criadoEm: Date | string;
    atualizadoEm: Date | string;
    empresa: {
        id: string;
        nomeEmpresa: string;
        setor?: string;
        localizacao?: string;
    };
    _count: {
        inscricoes: number;
    };
}

interface BrowseFilters {
    tipo?: string;
    faixaPreco?: string;
    duracao?: string;
    search?: string;
    page?: number;
    limit?: number;
}

interface BrowseResponse {
    servicos: ServicoWithEmpresa[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function useServicosBrowse() {
    const [servicos, setServicos] = useState<ServicoWithEmpresa[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchServicos = useCallback(async (filters: BrowseFilters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.tipo) params.append('tipo', filters.tipo);
            if (filters.faixaPreco) params.append('faixaPreco', filters.faixaPreco);
            if (filters.duracao) params.append('duracao', filters.duracao);
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());

            const response = await fetch(`/api/servicos-browse?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar serviços');
            }

            const data: BrowseResponse = await response.json();
            setServicos(data.servicos);
            setPagination(data.pagination);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao buscar serviços';
            setError(message);
            setServicos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        servicos,
        pagination,
        loading,
        error,
        fetchServicos,
    };
}
