import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';
import { UpdateServicoRequest } from '@/types';

// GET - Obter serviço específico
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
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const servico = await prisma.servico.findUnique({
            where: { id: params.id },
        });

        if (!servico) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        // Verificar se a empresa é proprietária
        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId },
        });

        if (!empresa || servico.empresaId !== empresa.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        return NextResponse.json(servico);
    } catch (error) {
        console.error('Erro ao buscar serviço:', error);
        return NextResponse.json({ error: 'Erro ao buscar serviço' }, { status: 500 });
    }
}

// PUT - Editar serviço
export async function PUT(
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
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId },
        });

        if (!empresa) {
            return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
        }

        const servico = await prisma.servico.findUnique({
            where: { id: params.id },
        });

        if (!servico) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        if (servico.empresaId !== empresa.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const data: UpdateServicoRequest = await request.json();

        // Preparar dados de atualização
        const updateData: any = {};

        if (data.titulo) updateData.titulo = data.titulo;
        if (data.tipo) updateData.tipo = data.tipo;
        if (data.descricao) updateData.descricao = data.descricao;
        if (data.faixaPreco) updateData.faixaPreco = data.faixaPreco;
        if (data.imagemUrl !== undefined) updateData.imagemUrl = data.imagemUrl;
        if (data.duracao) {
            if (data.duracao < 1 || data.duracao > 4) {
                return NextResponse.json({ error: 'A duração deve ser entre 1 e 4 semanas' }, { status: 400 });
            }
            updateData.duracao = data.duracao;
        }
        if (data.dataInicio) updateData.dataInicio = new Date(data.dataInicio);
        if (data.dataFim) updateData.dataFim = new Date(data.dataFim);
        if (data.status) updateData.status = data.status;

        // Validar datas se ambas forem fornecidas
        if (updateData.dataInicio && updateData.dataFim && updateData.dataFim <= updateData.dataInicio) {
            return NextResponse.json({ error: 'Data de fim deve ser após data de início' }, { status: 400 });
        }

        const servicoAtualizado = await prisma.servico.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(servicoAtualizado);
    } catch (error) {
        console.error('Erro ao editar serviço:', error);
        return NextResponse.json({ error: 'Erro ao editar serviço' }, { status: 500 });
    }
}

// DELETE - Deletar serviço
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
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId },
        });

        if (!empresa) {
            return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
        }

        const servico = await prisma.servico.findUnique({
            where: { id: params.id },
        });

        if (!servico) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        if (servico.empresaId !== empresa.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        // Verificar se tem inscrições/contratos
        const inscricoes = await prisma.inscricao.count({
            where: { servicoId: params.id },
        });

        if (inscricoes > 0) {
            return NextResponse.json(
                { error: 'Não é possível deletar um serviço que tem inscrições' },
                { status: 400 }
            );
        }

        await prisma.servico.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Serviço deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar serviço:', error);
        return NextResponse.json({ error: 'Erro ao deletar serviço' }, { status: 500 });
    }
}
