import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não é uma empresa' }, { status: 403 });
        }

        // Buscar a inscrição
        const inscricao = await prisma.inscricao.findUnique({
            where: { id: params.id },
            include: {
                servico: true,
                estudante: true,
            },
        });

        if (!inscricao) {
            return NextResponse.json(
                { error: 'Candidatura não encontrada' },
                { status: 404 }
            );
        }

        // Verificar se a empresa é dona do serviço
        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId },
        });

        if (!empresa || inscricao.servico.empresaId !== empresa.id) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        // Verificar se já existe um contrato para este serviço
        const contratoExistente = await prisma.contrato.findUnique({
            where: { servicoId: inscricao.servico.id },
        });

        if (contratoExistente) {
            return NextResponse.json(
                { error: 'Este serviço já possui um contrato aceito' },
                { status: 400 }
            );
        }

        // Criar contrato
        const contrato = await prisma.contrato.create({
            data: {
                servicoId: inscricao.servico.id,
                empresaId: empresa.id,
                estudanteId: inscricao.estudante.id,
                status: 'AGUARDANDO_INICIO',
                dataAceite: new Date(),
                prazoMaximoAvaliacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            },
            include: {
                estudante: {
                    include: {
                        user: true,
                    },
                },
                servico: true,
            },
        });

        return NextResponse.json({
            message: 'Candidato aceito com sucesso',
            contrato,
        });
    } catch (error) {
        console.error('Erro ao aceitar candidato:', error);
        return NextResponse.json(
            {
                error: 'Erro ao aceitar candidato',
                details: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 }
        );
    }
}
