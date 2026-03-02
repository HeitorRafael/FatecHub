# 🏃 Quick Start - TESTE LOCAL

## ⚡ Passos Mínimos para Rodar

### 1️⃣ Iniciar PostgreSQL (escolha uma opção)

**Via Docker (recomendado):**
```powershell
docker run --name fatechub-db `
  -e POSTGRES_PASSWORD=senha123 `
  -e POSTGRES_DB=fatechub `
  -p 5432:5432 `
  -d postgres:latest

docker ps  # Verificar se está rodando
```

**Via PostgreSQL local:**
- Se você já tem PostgreSQL instalado, apenas certifique-se de que o serviço está rodando
- Windows: Services → PostgreSQL → Start

### 2️⃣ Na pasta do projeto (`c:\DESENVOLVIMENTO\fatechub`)

Executar os comandos na ordem:

```powershell
# 1. Instalar dependências (só na primeira vez)
npm install

# 2. Rodar migrações do Prisma
npm run prisma:migrate
# → Quando perguntar o nome da migração, digite: initial
# → Pressione Enter para esperar

# 3. Criar dados de teste (admin, estudante, empresa)
npm run seed

# 4. Iniciar o servidor
npm run dev
```

## 🌐 Acessar a Aplicação

Após `npm run dev` rodar sem erros, acesse:

**http://localhost:3000**

Você será redirecionado para a página de login.

---

## 🧪 Credenciais de Teste

Após rodar `npm run seed`, use:

### 👨‍💼 Admin
```
Email: admin@fatec.sp.gov.br
Senha: admin123
```

### 👨‍🎓 Estudante
```
Email: aluno@fatec.sp.gov.br
Senha: estudante123
```

### 🏢 Empresa
```
Email: contato@empresa.com
Senha: empresa123
```

---

## 🐛 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| `DATABASE_URL not found` | Verificar se `.env.local` existe na raiz |
| PostgreSQL não conecta | Rodar `docker run...` ou verificar serviço local |
| Porta 3000 em uso | Rodar `npm run dev -- -p 3001` |
| Erro ao fazer seed | Verificar se banco foi criado (`npm run prisma:migrate`) |
| Token não reconhece | Limpar cookies do navegador (F12 → Application → Cookies) |

---

## 📋 Verificação rápida

Se tudo deu certo, você deve ver:

✅ Migração completada sem erros  
✅ 3 usuários criados (admin, estudante, empresa)  
✅ Servidor rodando em `http://localhost:3000`  
✅ Página de login carregando normalmente  
✅ Login funcionando com as credenciais acima  

---

## 🎬 O que Testar

1. **Login** - Tente os 3 usuários diferentes
2. **Registros** - Tente criar uma conta nova de estudante (email @fatec.sp.gov.br)
3. **Logout** - Botão logout em cada dashboard
4. **Redirecionamento** - Cada tipo vai para seu dashboard correto

---

**Pronto!** Quando terminar os testes, apenas me avise para começarmos a **Fase 2** 🚀
