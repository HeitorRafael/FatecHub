import { prisma } from '../db/client';
import { hashPassword, verifyPassword } from './password';
import { generateToken } from './jwt';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterEstudanteRequest,
  RegisterEmpresaRequest,
  AuthUser 
} from '@/types';

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || user.deletedAt) {
    throw new Error('Usuário não encontrado');
  }

  const passwordMatch = await verifyPassword(data.password, user.passwordHash);
  if (!passwordMatch) {
    throw new Error('Senha incorreta');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    foto: user.foto || undefined,
  };

  return { token, user: authUser };
}

export async function registerEstudante(data: RegisterEstudanteRequest): Promise<LoginResponse> {
  // Validar email institucional
  if (!data.email.endsWith(process.env.FATEC_EMAIL_DOMAIN || '@fatec.sp.gov.br')) {
    throw new Error('Você deve usar um email institucional da FATEC');
  }

  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Verificar se RA já existe
  const existingRA = await prisma.estudante.findUnique({
    where: { ra: data.ra },
  });

  if (existingRA) {
    throw new Error('RA já cadastrado');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      nome: data.nome,
      role: 'ESTUDANTE',
      estudante: {
        create: {
          ra: data.ra,
          emailSecundario: data.emailSecundario,
          telefoneMestre: data.telefoneMestre,
          mestre: data.mestre,
          curso: data.curso,
        },
      },
    },
    include: {
      estudante: true,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
  };

  return { token, user: authUser };
}

export async function registerEmpresa(data: RegisterEmpresaRequest): Promise<LoginResponse> {
  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      nome: data.nomeResponsavel,
      role: 'EMPRESA',
      empresa: {
        create: {
          nomeEmpresa: data.nomeEmpresa,
          telefoneContato: data.telephoneContato,
          emailContato: data.emailContato,
          enderecoEmpresa: data.enderecoEmpresa,
        },
      },
    },
    include: {
      empresa: true,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
  };

  return { token, user: authUser };
}

export async function createAdmin(email: string, password: string, nome: string) {
  // Verificar se há pelo menos um admin (para a regra de negócio)
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nome,
      role: 'ADMIN',
      admin: {
        create: {},
      },
    },
    include: {
      admin: true,
    },
  });

  return user;
}
