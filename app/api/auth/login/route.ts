import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/service';
import { LoginRequest } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json();

        if (!body.email || !body.password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const response = await loginUser(body);

        // Criar resposta com cookie HTTP-only para o token
        const response_obj = NextResponse.json(response);
        response_obj.cookies.set('authToken', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 dias
        });

        return response_obj;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao fazer login';
        return NextResponse.json(
            { error: message },
            { status: 401 }
        );
    }
}
