import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

// GET - Listar todos os serviços disponíveis para navegação/browsing
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Parâmetros de filtro
        const tipo = searchParams.get('tipo');
        const faixaPreco = searchParams.get('faixaPreco');
        const duracao = searchParams.get('duracao');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        // Construir filtros
        const where: any = {
            status: 'ATIVO',
        };

        if (tipo) {
            where.tipo = tipo;
        }

        if (faixaPreco) {
            where.faixaPreco = faixaPreco;
        }

        if (duracao) {
            where.duracao = parseInt(duracao);
        }

        if (search) {
            where.OR = [
                { titulo: { contains: search, mode: 'insensitive' } },
                { descricao: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Contar total para paginação
        const total = await prisma.servico.count({ where });

        // Buscar serviços com dados da empresa
        const servicos = await prisma.servico.findMany({
            where,
            include: {
                empresa: {
                    select: {
                        id: true,
                        nomeEmpresa: true,
                        setor: true,
                        localizacao: true,
                    },
                },
                _count: {
                    select: {
                        inscricoes: true,
                    },
                },
            },
            orderBy: { criadoEm: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            servicos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Erro ao listar serviços para browsing:', error);
        return NextResponse.json({ error: 'Erro ao listar serviços' }, { status: 500 });
    }
}
