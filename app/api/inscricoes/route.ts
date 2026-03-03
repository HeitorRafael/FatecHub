import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

// GET - Listar inscrições do estudante
export async function GET(request: NextRequest) {
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

        const inscricoes = await prisma.inscricao.findMany({
            where: { estudanteId: estudante.id },
            include: {
                servico: {
                    select: {
                        id: true,
                        titulo: true,
                        tipo: true,
                        descricao: true,
                        empresa: {
                            select: {
                                id: true,
                                nomeEmpresa: true,
                            },
                        },
                    },
                },
            },
            orderBy: { criadoEm: 'desc' },
        });

        return NextResponse.json(inscricoes);
    } catch (error) {
        console.error('Erro ao listar inscrições:', error);
        return NextResponse.json({ error: 'Erro ao listar inscrições' }, { status: 500 });
    }
}

// POST - Criar nova inscrição/candidatura
export async function POST(request: NextRequest) {
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

        const { servicoId } = await request.json();

        if (!servicoId) {
            return NextResponse.json({ error: 'ID do serviço é obrigatório' }, { status: 400 });
        }

        // Verificar se o serviço existe
        const servico = await prisma.servico.findUnique({
            where: { id: servicoId },
        });

        if (!servico) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        // Verificar se o serviço está ativo
        if (servico.status !== 'ATIVO') {
            return NextResponse.json({ error: 'Serviço não está ativo' }, { status: 400 });
        }

        // Verificar se já se candidatou
        const existingInscricao = await prisma.inscricao.findFirst({
            where: {
                estudanteId: estudante.id,
                servicoId: servicoId,
            },
        });

        if (existingInscricao) {
            return NextResponse.json({ error: 'Você já se candidatou a este serviço' }, { status: 409 });
        }

        // Criar inscrição
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        
        const inscricao = await prisma.inscricao.create({
            data: {
                estudanteId: estudante.id,
                servicoId: servicoId,
                horaInscricao: horaAtual,
            },
            include: {
                servico: {
                    select: {
                        id: true,
                        titulo: true,
                        tipo: true,
                        descricao: true,
                        empresa: {
                            select: {
                                id: true,
                                nomeEmpresa: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(inscricao, { status: 201 });
    } catch (error) {
        console.error('❌ Erro COMPLETO ao criar inscrição:', error);
        if (error instanceof Error) {
            console.error('❌ Mensagem:', error.message);
            console.error('❌ Stack:', error.stack);
        }
        return NextResponse.json(
            { 
                error: 'Erro ao criar inscrição',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            }, 
            { status: 500 }
        );
    }
}
