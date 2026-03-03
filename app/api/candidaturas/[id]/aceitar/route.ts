import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔥 POST candidato aceitar - ID:', id);
        
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não é empresa' }, { status: 403 });
        }

        const inscricao = await prisma.inscricao.findUnique({
            where: { id },
            include: {
                servico: true,
                estudante: { include: { user: true } }
            },
        });

        if (!inscricao) {
            return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
        }

        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId }
        });

        if (!empresa) {
            return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 403 });
        }

        if (inscricao.servico.empresaId !== empresa.id) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const contratoExistente = await prisma.contrato.findUnique({
            where: {
                servicoId_estudanteId: {
                    servicoId: inscricao.servicoId,
                    estudanteId: inscricao.estudanteId,
                },
            },
        });

        if (contratoExistente) {
            return NextResponse.json({ error: 'Já aceito' }, { status: 400 });
        }

        const contrato = await prisma.contrato.create({
            data: {
                servicoId: inscricao.servicoId,
                empresaId: empresa.id,
                estudanteId: inscricao.estudanteId,
                status: 'AGUARDANDO_INICIO',
                dataAceite: new Date(),
                prazoMaximoAvaliacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            include: {
                estudante: { include: { user: true } },
                servico: true,
            },
        });

        await prisma.inscricao.update({
            where: { id },
            data: { anonimoParaEmpresa: false }
        });

        console.log('✅ Contrato criado:', contrato.id);
        return NextResponse.json({ message: 'Sucesso', contrato });
    } catch (error) {
        console.error('❌ ERRO:', error);
        return NextResponse.json(
            { error: 'Erro', details: error instanceof Error ? error.message : 'Desconhecido' },
            { status: 500 }
        );
    }
}
