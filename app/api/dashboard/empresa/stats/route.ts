import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
    try {
        // Verificar se está autenticado
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'EMPRESA') {
            return NextResponse.json({ error: 'Não é uma empresa' }, { status: 403 });
        }

        // Buscar empresa
        const empresa = await prisma.empresa.findUnique({
            where: { userId: decoded.userId },
        });

        if (!empresa) {
            return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
        }

        // Buscar serviços da empresa
        const servicos = await prisma.servico.findMany({
            where: { empresaId: empresa.id },
            select: { id: true },
        });
        const servicoIds = servicos.map(s => s.id);

        // Buscar estatísticas
        const [vagasAbertas, candidaturas, emAndamento, concluidos] = await Promise.all([
            prisma.servico.count({ where: { empresaId: empresa.id, status: 'ATIVO' } }),
            prisma.inscricao.count({ where: { servicoId: { in: servicoIds } } }),
            prisma.contrato.count({ where: { empresaId: empresa.id, status: 'EM_ANDAMENTO' } }),
            prisma.contrato.count({ where: { empresaId: empresa.id, status: 'CONCLUIDO' } }),
        ]);

        return NextResponse.json({
            vagasAbertas,
            candidaturas,
            emAndamento,
            concluidos,
        });
    } catch (error) {
        console.error('Erro ao buscar stats empresa:', error);
        return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
    }
}
