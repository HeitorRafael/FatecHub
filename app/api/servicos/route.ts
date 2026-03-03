import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';
import { CreateServicoRequest } from '@/types';

// GET - Listar serviços da empresa
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

        const servicos = await prisma.servico.findMany({
            where: { empresaId: empresa.id },
            include: {
                contrato: {
                    select: { id: true }
                }
            },
            orderBy: { criadoEm: 'desc' },
        });

        return NextResponse.json(servicos);
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
        return NextResponse.json({ error: 'Erro ao listar serviços' }, { status: 500 });
    }
}

// POST - Criar novo serviço
export async function POST(request: NextRequest) {
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

        const data: CreateServicoRequest = await request.json();

        // Validar dados
        if (!data.titulo || !data.tipo || !data.descricao || !data.faixaPreco || !data.dataInicio || !data.dataFim || !data.duracao) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        // Validar duração (máximo 4 semanas)
        if (data.duracao < 1 || data.duracao > 4) {
            return NextResponse.json({ error: 'A duração deve ser entre 1 e 4 semanas' }, { status: 400 });
        }

        // Validar datas
        const dataInicio = new Date(data.dataInicio);
        const dataFim = new Date(data.dataFim);

        if (dataFim <= dataInicio) {
            return NextResponse.json({ error: 'Data de fim deve ser após data de início' }, { status: 400 });
        }

        const servico = await prisma.servico.create({
            data: {
                empresaId: empresa.id,
                titulo: data.titulo,
                tipo: data.tipo,
                descricao: data.descricao,
                faixaPreco: data.faixaPreco,
                imagemUrl: data.imagemUrl,
                dataInicio,
                dataFim,
                duracao: data.duracao,
                status: 'ATIVO',
            },
        });

        return NextResponse.json(servico, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
    }
}
