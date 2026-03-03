import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('=== Iniciando aceitar candidato ===');
        console.log('Inscrição ID:', params.id);
        
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não é uma empresa' }, { status: 403 });
        }

        console.log('Usuário verificado:', decoded.userId);

        // Buscar a inscrição com todos os dados necessários
        const inscricao = await prisma.inscricao.findUnique({
            where: { id: params.id },
            include: {
                servico: true,
                estudante: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        console.log('Inscrição encontrada:', inscricao?.id);

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

        console.log('Empresa encontrada:', empresa?.id);

        if (!empresa) {
            return NextResponse.json(
                { error: 'Empresa não encontrada' },
                { status: 403 }
            );
        }

        if (inscricao.servico.empresaId !== empresa.id) {
            console.log('Acesso negado: empresa não é dona do serviço');
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        // Verificar se já existe um contrato para este serviço/estudante
        const contratoExistente = await prisma.contrato.findUnique({
            where: {
                servicoId_estudanteId: {
                    servicoId: inscricao.servico.id,
                    estudanteId: inscricao.estudante.id,
                },
            },
        });

        if (contratoExistente) {
            console.log('Contrato já existe para este serviço/estudante');
            return NextResponse.json(
                { error: 'Este candidato já foi aceito para este serviço' },
                { status: 400 }
            );
        }

        console.log('Criando contrato');
        // Criar contrato
        const contrato = await prisma.contrato.create({
            data: {
                servicoId: inscricao.servico.id,
                empresaId: empresa.id,
                estudanteId: inscricao.estudante.id,
                status: 'AGUARDANDO_INICIO',
                dataAceite: new Date(),
                prazoMaximoAvaliacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

        // Marcar inscrição como não anônima após contrato criado
        await prisma.inscricao.update({
            where: { id: params.id },
            data: { anonimoParaEmpresa: false },
        });

        console.log('Contrato criado e inscrição marcada:', contrato.id);

        return NextResponse.json({
            message: 'Candidato aceito com sucesso',
            contrato,
        });
    } catch (error) {
        console.error('=== ERRO ao aceitar candidato ===');
        console.error('Erro completo:', error);
        if (error instanceof Error) {
            console.error('Mensagem:', error.message);
            console.error('Stack:', error.stack);
        }
        return NextResponse.json(
            {
                error: 'Erro ao aceitar candidato',
                details: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 }
        );
    }
}
