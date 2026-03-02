import AuthTabs from '@/components/auth/AuthTabs';

export const metadata = {
    title: 'FatecHub - Login',
    description: 'Plataforma de conexão entre alunos da FATEC e empresas',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">FatecHub</h1>
                    <p className="text-gray-600">
                        Conectando alunos FATEC com oportunidades
                    </p>
                </div>

                <AuthTabs />

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-xs text-gray-500">
                        © 2026 FatecHub. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
