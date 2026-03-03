import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

// GET - Listar todas as candidaturas dos serviços da empresa
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não é uma empresa' }, { status: 403 });
        }

        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId },
        });

        if (!empresa) {
            return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
        }

        // Buscar todas as inscrições dos serviços desta empresa, agrupadas por serviço
        const servicos = await prisma.servico.findMany({
            where: { empresaId: empresa.id },
            include: {
                inscricoes: {
                    include: {
                        estudante: {
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        nome: true,
                                        email: true,
                                        foto: true,
                                    },
                                },
                                ra: true,
                                curso: true,
                                mestre: true,
                                pontuacao: true,
                            },
                        },
                    },
                    orderBy: { criadoEm: 'desc' },
                },
            },
            orderBy: { criadoEm: 'desc' },
        });

        // Contar total de candidaturas
        const totalCandidaturas = servicos.reduce(
            (acc, servico) => acc + servico.inscricoes.length,
            0
        );

        return NextResponse.json({
            empresa: {
                id: empresa.id,
                nomeEmpresa: empresa.nomeEmpresa,
            },
            servicos,
            totalCandidaturas,
            dataAtualizacao: new Date(),
        });
    } catch (error) {
        console.error('Erro ao listar candidaturas:', error);
        return NextResponse.json(
            {
                error: 'Erro ao listar candidaturas',
                details: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 }
        );
    }
}
