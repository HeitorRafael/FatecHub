'use client';

import { useState } from 'react';
import { CreateServicoRequest, ServicoTipo, FaixaPreco } from '@/types';

interface CreateServicoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateServicoRequest) => Promise<void>;
    isLoading?: boolean;
}

export default function CreateServicoModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}: CreateServicoModalProps) {
    const [formData, setFormData] = useState<CreateServicoRequest>({
        titulo: '',
        tipo: 'DESENVOLVIMENTO',
        descricao: '',
        faixaPreco: 'CINQUENTA_CEM',
        imagemUrl: '',
        dataInicio: '',
        dataFim: '',
        duracao: 2,
    });
    const [error, setError] = useState<string | null>(null);

    const tipos: { value: ServicoTipo; label: string }[] = [
        { value: 'DESIGN', label: '🎨 Design' },
        { value: 'DESENVOLVIMENTO', label: '💻 Desenvolvimento' },
        { value: 'CONSULTORIA', label: '💼 Consultoria' },
        { value: 'MARKETING', label: '📢 Marketing' },
        { value: 'GESTAO_PROJETOS', label: '📊 Gestão de Projetos' },
        { value: 'ANALISE_DADOS', label: '📈 Análise de Dados' },
        { value: 'TRADUCAO', label: '🌐 Tradução' },
        { value: 'REDACAO', label: '✍️ Redação' },
        { value: 'TUTORIA', label: '👨‍🏫 Tutoria' },
        { value: 'OUTRO', label: '⭐ Outro' },
    ];

    const faixas: { value: FaixaPreco; label: string }[] = [
        { value: 'VINTE_CINQUENTA', label: 'R$ 20 - R$ 50' },
        { value: 'CINQUENTA_CEM', label: 'R$ 50 - R$ 100' },
        { value: 'CEM_DUZENTOS', label: 'R$ 100 - R$ 200' },
        { value: 'DUZENTOS_QUINHENTOS', label: 'R$ 200 - R$ 500' },
        { value: 'QUINHENTOS_MIL', label: 'R$ 500 - R$ 1.000' },
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duracao' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validar campos obrigatórios
        if (!formData.titulo || !formData.descricao || !formData.dataInicio || !formData.dataFim) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }

        if (formData.duracao < 1 || formData.duracao > 4) {
            setError('A duração deve ser entre 1 e 4 semanas');
            return;
        }

        try {
            await onSubmit(formData);
            // Limpar formulário e fechar modal ao sucesso
            setFormData({
                titulo: '',
                tipo: 'DESENVOLVIMENTO',
                descricao: '',
                faixaPreco: 'CINQUENTA_CEM',
                imagemUrl: '',
                dataInicio: '',
                dataFim: '',
                duracao: 2,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar serviço');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-red-600 border-b-4 border-red-700 px-6 py-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white">Criar Novo Serviço</h2>
                        <button
                            onClick={onClose}
                            className="text-white text-2xl hover:text-red-100 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Título */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Título do Serviço *
                        </label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ex: Website Responsivo"
                            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                        />
                    </div>

                    {/* Tipo e Duração */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Tipo de Serviço *
                            </label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                            >
                                {tipos.map(tipo => (
                                    <option key={tipo.value} value={tipo.value}>
                                        {tipo.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Duração (semanas) *
                            </label>
                            <select
                                name="duracao"
                                value={formData.duracao}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                            >
                                <option value={1}>1 semana</option>
                                <option value={2}>2 semanas</option>
                                <option value={3}>3 semanas</option>
                                <option value={4}>4 semanas</option>
                            </select>
                        </div>
                    </div>

                    {/* Faixa de Preço */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Faixa de Preço *
                        </label>
                        <select
                            name="faixaPreco"
                            value={formData.faixaPreco}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                        >
                            {faixas.map(faixa => (
                                <option key={faixa.value} value={faixa.value}>
                                    {faixa.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Data de Início *
                            </label>
                            <input
                                type="date"
                                name="dataInicio"
                                value={formData.dataInicio}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Data de Fim *
                            </label>
                            <input
                                type="date"
                                name="dataFim"
                                value={formData.dataFim}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Descrição *
                        </label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Descreva detalhadamente o que você precisa..."
                            rows={4}
                            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                        />
                    </div>

                    {/* URL da Imagem */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            URL da Imagem
                        </label>
                        <input
                            type="url"
                            name="imagemUrl"
                            value={formData.imagemUrl || ''}
                            onChange={handleChange}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
                        >
                            {isLoading ? 'Criando...' : 'Criar Serviço'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
