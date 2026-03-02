import { PrismaClient } from '@prisma/client';
import { PgDataSource } from '@prisma/adapter-pg';
import bcryptjs from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PgDataSource(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Criando dados iniciais...\n');

  try {
    const hashPassword = await bcryptjs.hash('admin123', 10);

    // Criar Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@fatec.sp.gov.br',
        passwordHash: hashPassword,
        nome: 'Admin FATEC',
        role: 'ADMIN',
        admin: {
          create: {},
        },
      },
    });

    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha: admin123\n');

    // Criar um estudante de teste
    const hashPasswordEstudante = await bcryptjs.hash('estudante123', 10);
    const estudante = await prisma.user.create({
      data: {
        email: 'aluno@fatec.sp.gov.br',
        passwordHash: hashPasswordEstudante,
        nome: 'João Silva',
        role: 'ESTUDANTE',
        estudante: {
          create: {
            ra: 'SP1234567',
            emailSecundario: 'joao@gmail.com',
            telefoneMestre: '(11) 98765-4321',
            mestre: 'Prof. Carlos',
            curso: 'Análise e Desenvolvimento de Sistemas',
          },
        },
      },
    });

    console.log('✅ Estudante de teste criado!');
    console.log('📧 Email:', estudante.email);
    console.log('🔑 Senha: estudante123\n');

    // Criar uma empresa de teste
    const hashPasswordEmpresa = await bcryptjs.hash('empresa123', 10);
    const empresa = await prisma.user.create({
      data: {
        email: 'contato@empresa.com',
        passwordHash: hashPasswordEmpresa,
        nome: 'João Gerente',
        role: 'EMPRESA',
        empresa: {
          create: {
            nomeEmpresa: 'Tech Solutions Ltda',
           enderecoEmpresa: 'Rua das Flores, 123 - São Paulo, SP',
            telefoneContato: '(11) 3456-7890',
            emailContato: 'contato@empresa.com',
          },
        },
      },
    });

    console.log('✅ Empresa de teste criada!');
    console.log('📧 Email:', empresa.email);
    console.log('🔑 Senha: empresa123\n');

    console.log('═══════════════════════════════════════════');
    console.log('🎉 Dados iniciais criados com sucesso!');
    console.log('═══════════════════════════════════════════\n');

    console.log('📝 Credenciais de teste:\n');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: admin@fatec.sp.gov.br');
    console.log('   Senha: admin123\n');

    console.log('👨‍🎓 ESTUDANTE:');
    console.log('   Email: aluno@fatec.sp.gov.br');
    console.log('   Senha: estudante123\n');

    console.log('🏢 EMPRESA:');
    console.log('   Email: contato@empresa.com');
    console.log('   Senha: empresa123\n');

  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
