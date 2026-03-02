-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ESTUDANTE', 'EMPRESA');

-- CreateEnum
CREATE TYPE "ServicoTipo" AS ENUM ('DESIGN', 'DESENVOLVIMENTO', 'CONSULTORIA', 'MARKETING', 'GESTAO_PROJETOS', 'ANALISE_DADOS', 'TRADUCAO', 'REDACAO', 'TUTORIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "FaixaPreco" AS ENUM ('VINTE_CINQUENTA', 'CINQUENTA_CEM', 'CEM_DUZENTOS', 'DUZENTOS_QUINHENTOS', 'QUINHENTOS_MIL');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('AGUARDANDO_INICIO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusServico" AS ENUM ('ATIVO', 'PAUSADO', 'ENCERRADO', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "foto" TEXT,
    "role" "UserRole" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudantes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ra" TEXT NOT NULL,
    "emailSecundario" TEXT,
    "telefoneMestre" TEXT NOT NULL,
    "mestre" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "pontuacao" INTEGER NOT NULL DEFAULT 0,
    "acessosCount" INTEGER NOT NULL DEFAULT 0,
    "ultimoAcesso" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "enderecoEmpresa" TEXT NOT NULL,
    "telefoneContato" TEXT NOT NULL,
    "emailContato" TEXT NOT NULL,
    "acessosCount" INTEGER NOT NULL DEFAULT 0,
    "ultimoAcesso" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "ServicoTipo" NOT NULL,
    "descricao" TEXT NOT NULL,
    "faixaPreco" "FaixaPreco" NOT NULL,
    "imagemUrl" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "duracao" INTEGER NOT NULL,
    "status" "StatusServico" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscricoes" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "estudanteId" TEXT NOT NULL,
    "dataInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaInscricao" TEXT NOT NULL,
    "anonimoParaEmpresa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscricoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "estudanteId" TEXT NOT NULL,
    "status" "StatusContrato" NOT NULL DEFAULT 'AGUARDANDO_INICIO',
    "dataAceite" TIMESTAMP(3) NOT NULL,
    "dataConclusao" TIMESTAMP(3),
    "prazoMaximoAvaliacao" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "estudanteId" TEXT NOT NULL,
    "notacao" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "aprovadoPorAdmin" BOOLEAN NOT NULL DEFAULT false,
    "dataAprovacao" TIMESTAMP(3),
    "posicaoCarrossel" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" TEXT NOT NULL,
    "estudanteId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens_inspiracao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensagens_inspiracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "tabela" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "estudantes_userId_key" ON "estudantes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "estudantes_ra_key" ON "estudantes"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_userId_key" ON "empresas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_telefoneContato_key" ON "empresas"("telefoneContato");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_servicoId_estudanteId_key" ON "inscricoes"("servicoId", "estudanteId");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_servicoId_key" ON "contratos"("servicoId");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_servicoId_estudanteId_key" ON "contratos"("servicoId", "estudanteId");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_contratoId_key" ON "feedbacks"("contratoId");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudantes" ADD CONSTRAINT "estudantes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "estudantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "estudantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "estudantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "estudantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
