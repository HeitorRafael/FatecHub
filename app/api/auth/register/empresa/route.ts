import { NextRequest, NextResponse } from 'next/server';
import { registerEmpresa } from '@/lib/auth/service';
import { RegisterEmpresaRequest } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: RegisterEmpresaRequest = await request.json();

        // Validações básicas
        if (!body.email || !body.password || !body.nomeEmpresa || !body.telephoneContato || !body.emailContato || !body.enderecoEmpresa || !body.nomeResponsavel) {
            return NextResponse.json(
                { error: 'Todos os campos obrigatórios devem ser preenchidos' },
                { status: 400 }
            );
        }

        if (body.password.length < 8) {
            return NextResponse.json(
                { error: 'Senha deve ter no mínimo 8 caracteres' },
                { status: 400 }
            );
        }

        const response = await registerEmpresa(body);

        const response_obj = NextResponse.json(response);
        response_obj.cookies.set('authToken', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
        });

        return response_obj;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao registrar empresa';
        return NextResponse.json(
            { error: message },
            { status: 400 }
        );
    }
}
