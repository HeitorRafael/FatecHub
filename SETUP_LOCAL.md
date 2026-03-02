# 🚀 Guia de Início Rápido - FatecHub LOCAL

## Primeiros Passos

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/HeitorRafael/FatecHub.git
cd FatecHub
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar PostgreSQL (Windows)

#### Opção A: PostgreSQL instalado localmente
1. Instale PostgreSQL do site oficial (https://www.postgresql.org/download/windows/)
2. Durante a instalação, defina:
   - Usuário: `postgres`
   - Senha: `senha123`
   - Porta: `5432`

3. Criar banco de dados:
```bash
# Abra o psql (prompt do PostgreSQL)
psql -U postgres

# No prompt, execute:
CREATE DATABASE fatechub;
\c fatechub
```

#### Opção B: PostgreSQL com Docker (Recomendado)
```bash
# Instale Docker Desktop se ainda não tiver

# Criar e rodar container PostgreSQL
docker run --name fatechub-db `
  -e POSTGRES_PASSWORD=senha123 `
  -e POSTGRES_DB=fatechub `
  -p 5432:5432 `
  -d postgres:latest

# Verificar se está rodando
docker ps
```

### 4️⃣ Configurar Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/fatechub?schema=public"

# JWT
JWT_SECRET="sua-chave-jwt-super-secreta-aqui-mude-em-producao-2026"
JWT_EXPIRES_IN="7d"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Email institucional
FATEC_EMAIL_DOMAIN="@fatec.sp.gov.br"
```

### 5️⃣ Rodar Migrações do Prisma
```bash
npm run prisma:migrate
```

Na primeira vez, escolha um nome para a migração, por exemplo: `initial`

### 6️⃣ Iniciar o Servidor
```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🧪 Testando a Aplicação

### Criar um Admin (IMPORTANTE)
Você precisa criar um admin manualmente primeiro. Execute:

```bash
npm run prisma:studio
```

Isso abre uma interface visual. Você pode inserir dados manualmente nos primeiros testes, ou usar este script Node:

```javascript
// Crie um arquivo: scripts/seed.js
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashPassword = await bcryptjs.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fatec.sp.gov.br',
      passwordHash: hashPassword,
      nome: 'Admin FATEC',
      role: 'ADMIN',
      admin: {
        create: {}
      }
    }
  });
  
  console.log('Admin criado:', admin.email);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
```

Depois execute:
```bash
node scripts/seed.js
```

### Testar Login
1. Abra http://localhost:3000
2. Clique em **Login**
3. Use as credenciais:
   - Email: `admin@fatec.sp.gov.br`
   - Senha: `admin123`

---

## 📋 Estrutura Atual

### Autenticação
- ✅ Login para 3 tipos (Admin, Estudante, Empresa)
- ✅ Registro de Estudante (valida email @fatec)
- ✅ Registro de Empresa (cadastro rápido)
- ✅ Logout
- ✅ JWT com cookies seguros

### Dashboards Base
- ✅ Admin Dashboard (com menu lateral)
- ✅ Estudante Dashboard (estrutura base)
- ✅ Empresa Dashboard (estrutura base)

### Banco de Dados
- ✅ Schema completo com todos os modelos
- ✅ Relacionamentos entre tabelas
- ✅ Soft delete para dados históricos
- ✅ Enums para tipos e status

---

## 🔨 Próximos Passos para Desenvolvimento

### Fase 2: Perfil e Config do Usuário
- [ ] Editar perfil pessoal
- [ ] Trocar senha
- [ ] Upload de foto de perfil
- [ ] Validar email (enviar confirmação)

### Fase 3: Dashboard Admin
- [ ] Listar todos os alunos
- [ ] Listar todas as empresas
- [ ] Ver estatísticas (acessos, pedidos, etc)
- [ ] Gerenciar feedback (aprovar/rejeitar)
- [ ] Criar mais admins
- [ ] Excluir contas de alunos/empresas

### Fase 4: Dashboard Estudante
- [ ] Carrossel de oportunidades
- [ ] Filtro por tipo de serviço
- [ ] Se candidatar a serviço (máx 2)
- [ ] Ver ranking de alunos mais ativos
- [ ] Visão de contratos vigentes
- [ ] Histórico de trabalhos realizados

### Fase 5: Dashboard Empresa
- [ ] Criar novo serviço
- [ ] Editar serviço
- [ ] Ver inscrições (anônimas no início)
- [ ] Aceitar/Rejeitar estudante
- [ ] Visualizar dados de contratado
- [ ] Avaliar trabalho realizado
- [ ] Ver histórico de contratos

### Fase 6: Recursos Avançados
- [ ] Upload de imagens (AWS S3)
- [ ] Envio de emails
- [ ] Notificações em tempo real
- [ ] Testes automatizados
- [ ] Deploy no Vercel

---

## 📞 Troubleshooting

### Erro: "DATABASE_URL not found"
- Certifique-se que `.env.local` existe e tem `DATABASE_URL`
- Verifique se PostgreSQL está rodando
- Teste: `psql -U postgres -c "SELECT 1"`

### Erro: "Cannot find module 'prisma'"
```bash
npm install
npm run prisma:generate
```

### PostgreSQL está dando erro de conexão
- Verifique se o serviço está rodando:
  - **Windows**: Services → PostgreSQL
  - **Docker**: `docker ps`
- Teste a conexão: `psql -U postgres`

### Porta 3000 já está em uso
```bash
npm run dev -- -p 3001
```

---

## 🎯 Checklist de Setup Completo

- [ ] Repositório clonado
- [ ] `npm install` executado
- [ ] PostgreSQL rodando
- [ ] `.env.local` criado e configurado
- [ ] `npm run prisma:migrate` executado
- [ ] `npm run dev` rodando sem erros
- [ ] http://localhost:3000 acessível
- [ ] Admin criado e login testado

Se tudo estiver OK, você está pronto para começar o desenvolvimento! 🚀

---

**Dúvidas?** Abra uma issue no GitHub ou entre em contato.
