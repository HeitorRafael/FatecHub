import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

// GET - Fetch inscricao específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'ESTUDANTE') {
            return NextResponse.json({ error: 'Não é um estudante' }, { status: 403 });
        }

        const estudante = await prisma.estudante.findUnique({
            where: { userId: decoded.userId },
        });

        if (!estudante) {
            return NextResponse.json({ error: 'Estudante não encontrado' }, { status: 404 });
        }

        const inscricao = await prisma.inscricao.findUnique({
            where: { id: params.id },
            include: {
                servico: true,
            },
        });

        if (!inscricao) {
            return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
        }

        // Verificar propriedade
        if (inscricao.estudanteId !== estudante.id) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        return NextResponse.json(inscricao);
    } catch (error) {
        console.error('Erro ao buscar inscrição:', error);
        return NextResponse.json({ error: 'Erro ao buscar inscrição' }, { status: 500 });
    }
}

// DELETE - Cancelar inscrição
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'ESTUDANTE') {
            return NextResponse.json({ error: 'Não é um estudante' }, { status: 403 });
        }

        const estudante = await prisma.estudante.findUnique({
            where: { userId: decoded.userId },
        });

        if (!estudante) {
            return NextResponse.json({ error: 'Estudante não encontrado' }, { status: 404 });
        }

        const inscricao = await prisma.inscricao.findUnique({
            where: { id: params.id },
        });

        if (!inscricao) {
            return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
        }

        // Verificar propriedade
        if (inscricao.estudanteId !== estudante.id) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        // Só pode cancelar se status for PENDENTE
        if (inscricao.status !== 'PENDENTE') {
            return NextResponse.json({ error: 'Só pode cancelar inscrições pendentes' }, { status: 400 });
        }

        await prisma.inscricao.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Inscrição cancelada' });
    } catch (error) {
        console.error('Erro ao cancelar inscrição:', error);
        return NextResponse.json({ error: 'Erro ao cancelar inscrição' }, { status: 500 });
    }
}
