import { NextRequest, NextResponse } from 'next/server';
import { registerEstudante } from '@/lib/auth/service';
import { RegisterEstudanteRequest } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: RegisterEstudanteRequest = await request.json();

        // Validações básicas
        if (!body.email || !body.password || !body.nome || !body.ra || !body.telefoneMestre || !body.mestre || !body.curso) {
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

        const response = await registerEstudante(body);

        const response_obj = NextResponse.json(response);
        response_obj.cookies.set('authToken', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
        });

        return response_obj;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao registrar estudante';
        return NextResponse.json(
            { error: message },
            { status: 400 }
        );
    }
}
