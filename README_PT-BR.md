# FatecHub 🎓

Plataforma de conexão entre alunos da FATEC e empresas para trabalhos freelance e registrados.

## 🚀 Funcionalidades

### Três Tipos de Usuários
- **Admin**: Gerenciamento completo da plataforma
- **Estudante**: Buscar e se candidatar a trabalhos
- **Empresa**: Publicar serviços e contratar estudantes

### Principais Features
- ✅ Sistema de autenticação JWT com 3 roles
- ✅ Dashboard personalizado por tipo de usuário
- ✅ Cadastro de serviços/oportunidades
- ✅ Sistema de inscrições anônimas
- ✅ Contratos com feedback e avaliação
- ✅ Ranking de estudantes mais ativos
- ✅ Sistema de mensagens de inspiração
- ✅ Certificados/Histórico de trabalhos

## 🛠️ Stack Técnico

- **Frontend**: Next.js 14+ com TypeScript e Tailwind CSS
- **Backend**: API integrada no Next.js
- **Database**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT + Cookies HTTP-only
- **Deployment**: Vercel (próximos passos)

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 13+
- Git

## 🔧 Instalação e Setup

### 1. Clonar o repositório
```bash
git clone https://github.com/HeitorRafael/FatecHub.git
cd fatechub
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
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

### 4. Criar banco de dados PostgreSQL
```bash
createdb fatechub
```

### 5. Executar migrações Prisma
```bash
npm run prisma:migrate
```

### 6. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📝 Script do Prisma

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Criar/executar migrações
npm run prisma:migrate

# Abre Prisma Studio (UI do banco)
npm run prisma:studio
```

## 🗂️ Estrutura do Projeto

```
fatechub/
├── app/
│   ├── (auth)/              # Páginas de autenticação
│   ├── (dashboard)/         # Páginas do dashboard
│   │   ├── admin/
│   │   ├── estudante/
│   │   └── empresa/
│   └── api/
│       └── auth/            # Endpoints de autenticação
├── components/
│   ├── auth/                # Componentes de autenticação
│   └── common/              # Componentes reutilizáveis
├── lib/
│   ├── auth/                # Lógica de autenticação
│   └── db/                  # Cliente Prisma
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── styles/                  # Estilos globais
├── types/                   # Types TypeScript
└── utils/                   # Funções utilitárias
```

## 🔐 Segurança

- Senhas hasheadas com bcryptjs
- JWT com expiração em cookies HTTP-only
- Email institucional validado para estudantes
- Soft delete para dados históricos
- Validação de entrada em todos os endpoints

## 📊 Modelos de Dados

### User (Base)
- Email único
- Password hash
- Role (ADMIN | ESTUDANTE | EMPRESA)
- Soft delete

### Estudante
- RA único
- Email secundário
- Telefone e mestre
- Curso
- Pontuação e contador de acessos

### Empresa
- Nome da empresa
- Endereço e contatos
- Contador de acessos

### Serviço
- Tipo, descrição, faixa de preço
- Data de início/fim e duração
- Status (ATIVO | PAUSADO | ENCERRADO)

### Contrato
- Vinculação estudante ↔ empresa
- Status (AGUARDANDO_INICIO | EM_ANDAMENTO | CONCLUIDO)
- Prazo para avaliação (30 dias)

### Feedback
- Avaliação numérica (1-5)
- Descrição e aprovação por admin
- Posição no carrossel (máx 10)

## 🚢 Deployment no Vercel

Instruções serão fornecidas quando for necessário fazer o deploy.

## 📱 Próximos Passos

- [ ] Dashboard Admin completo
- [ ] Dashboard Estudante completo
- [ ] Dashboard Empresa completo
- [ ] Upload de imagens (AWS S3 ou similar)
- [ ] Notificações por email
- [ ] Validação de email
- [ ] Testes automáticos
- [ ] Deploy no Vercel

## 👨‍💻 Desenvolvedor

FatecHub © 2026

---

**Nota**: Este projeto está em desenvolvimento ativo. As funcionalidades estão sendo implementadas incrementalmente.
