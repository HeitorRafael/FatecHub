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
        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Não é um admin' }, { status: 403 });
        }

        // Buscar estatísticas
        const [totalEstudantes, totalEmpresas, servicosAtivos, contratosConcluidos] = await Promise.all([
            prisma.user.count({ where: { role: 'ESTUDANTE', deletedAt: null } }),
            prisma.user.count({ where: { role: 'EMPRESA', deletedAt: null } }),
            prisma.servico.count({ where: { status: 'ATIVO' } }),
            prisma.contrato.count({ where: { status: 'CONCLUIDO' } }),
        ]);

        return NextResponse.json({
            totalEstudantes,
            totalEmpresas,
            servicosAtivos,
            contratosConcluidos,
        });
    } catch (error) {
        console.error('Erro ao buscar stats admin:', error);
        return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
    }
}
