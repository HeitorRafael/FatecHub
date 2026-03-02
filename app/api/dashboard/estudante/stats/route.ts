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
        if (!decoded || decoded.role !== 'ESTUDANTE') {
            return NextResponse.json({ error: 'Não é um estudante' }, { status: 403 });
        }

        // Buscar estudante
        const estudante = await prisma.estudante.findUnique({
            where: { userId: decoded.userId },
        });

        if (!estudante) {
            return NextResponse.json({ error: 'Estudante não encontrado' }, { status: 404 });
        }

        // Buscar estatísticas
        const [oportunidadesDisponíveis, minhasAplicacoes, contratosAtivos, concluidos] = await Promise.all([
            prisma.servico.count({ where: { status: 'ATIVO' } }),
            prisma.inscricao.count({ where: { estudanteId: estudante.id } }),
            prisma.contrato.count({ where: { estudanteId: estudante.id, status: 'EM_ANDAMENTO' } }),
            prisma.contrato.count({ where: { estudanteId: estudante.id, status: 'CONCLUIDO' } }),
        ]);

        return NextResponse.json({
            oportunidadesDisponíveis,
            minhasAplicacoes,
            contratosAtivos,
            concluidos,
        });
    } catch (error) {
        console.error('Erro ao buscar stats estudante:', error);
        return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
    }
}
