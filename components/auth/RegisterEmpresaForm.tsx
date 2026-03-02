'use client';

import { useState } from 'react';
import { RegisterEmpresaRequest } from '@/types';

interface RegisterEmpresaFormProps {
    onSuccess: (role: string) => void;
}

export default function RegisterEmpresaForm({ onSuccess }: RegisterEmpresaFormProps) {
    const [formData, setFormData] = useState<RegisterEmpresaRequest>({
        email: '',
        password: '',
        nomeEmpresa: '',
        telephoneContato: '',
        emailContato: '',
        enderecoEmpresa: '',
        nomeResponsavel: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register/empresa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao registrar');
            }

            const data = await res.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            onSuccess(data.user.role);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                    Nome da Empresa *
                </label>
                <input
                    type="text"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                    Endereço *
                </label>
                <input
                    type="text"
                    name="enderecoEmpresa"
                    value={formData.enderecoEmpresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">
                        Email Contato *
                    </label>
                    <input
                        type="email"
                        name="emailContato"
                        value={formData.emailContato}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">
                        Telefone *
                    </label>
                    <input
                        type="tel"
                        name="telephoneContato"
                        value={formData.telephoneContato}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                    Nome do Responsável *
                </label>
                <input
                    type="text"
                    name="nomeResponsavel"
                    value={formData.nomeResponsavel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                    Email para Login *
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="seu@email.com"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                    Senha *
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Mínimo 8 caracteres"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
            >
                {loading ? 'Registrando...' : 'Registrar'}
            </button>
        </form>
    );
}
