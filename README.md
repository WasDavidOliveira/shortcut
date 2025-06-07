# 🔗 Shortcut

Um encurtador de URLs completo desenvolvido com Node.js e TypeScript, oferecendo redirecionamento automático, contagem de cliques e gerenciamento de URLs por usuário autenticado.

---

## 🚀 Funcionalidades Principais

### 🔗 Encurtamento de URLs
- Criação de códigos curtos únicos para URLs longas
- Redirecionamento automático para a URL original
- Contagem automática de cliques
- Sistema de ativação/desativação de URLs

### 👥 Gestão de Usuários
- Autenticação JWT segura
- Registro e login de usuários
- Cada usuário gerencia suas próprias URLs
- Sistema de permissões e roles

### 📊 Analytics
- Contagem de cliques por URL
- Histórico de URLs criadas por usuário
- Controle de URLs ativas/inativas

---

## 📚 Tecnologias Incluídas

### 🔧 Core
- **Express 5.1.0**: Framework web rápido e minimalista para Node.js
- **TypeScript 5.8.3**: Superset tipado de JavaScript
- **Zod 3.24.3**: Validação de schemas com inferência de tipos
- **Zod-OpenAPI 4.2.4**: Integração de Zod com OpenAPI para documentação automática

### 💾 Banco de Dados
- **Drizzle ORM 0.42.0**: ORM TypeScript-first com excelente experiência de desenvolvimento
- **PostgreSQL**: Banco de dados relacional (via pg 8.14.1)
- **Drizzle Kit**: Ferramentas CLI para migrações e gerenciamento de esquema

### 🔒 Segurança
- **Bcrypt 5.1.1**: Hashing de senhas
- **Helmet 8.1.0**: Segurança para aplicações Express
- **Express Rate Limit 7.5.0**: Limitação de requisições
- **CORS**: Configuração de Cross-Origin Resource Sharing
- **JsonWebToken 9.0.2**: Implementação de JWT para autenticação

### 🛠️ Utilidades
- **Dotenv 16.5.0**: Gerenciamento de variáveis de ambiente
- **Winston 3.17.0**: Logger para Node.js

### 👨‍💻 Desenvolvimento
- **ESLint 9.25.0**: Linting de código
- **Prettier 3.5.3**: Formatação de código
- **Vitest 3.1.1**: Framework de testes rápido
- **ts-node-dev**: Reinicialização automática durante desenvolvimento

---

## 📂 Estrutura do Projeto

```
src/
├── 📁 configs/          # Configurações da aplicação
├── 📁 controllers/      # Controladores que processam as requisições
├── 📁 db/               # Definições de schema e migrações do Drizzle
├── 📁 middlewares/      # Middlewares do Express
├── 📁 repositories/     # Camada de acesso aos dados
├── 📁 routes/           # Definições de rotas da API
├── 📁 services/         # Lógica de negócios
├── 📁 types/            # Definições de tipos e interfaces
├── 📁 utils/            # Funções utilitárias
├── 📁 validations/      # Schemas Zod para validação
└── 📄 server.ts         # Ponto de entrada da aplicação
```

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/WasDavidOliveira/shortcut.git
cd shortcut

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações de banco de dados

# Execute as migrações do banco
npm run db:migrate

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📋 Scripts Disponíveis

- `npm run dev` - ▶️ Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - 🏗️ Compila o código TypeScript para JavaScript
- `npm run start` - 🚀 Inicia o servidor em modo de produção (após o build)
- `npm run lint` - 🔍 Executa a verificação de linting com ESLint
- `npm run format` - ✨ Formata o código com Prettier
- `npm run db:generate` - 📝 Gera migrações com base nas alterações do schema
- `npm run db:migrate` - 📊 Executa as migrações pendentes
- `npm run db:studio` - 🔬 Inicia o Drizzle Studio para visualização e edição do banco
- `npm run db:push` - 📤 Sincroniza o banco de dados com o schema atual

---

## 🔗 Como Usar o Encurtador

### 1. Autenticação
Primeiro, registre um usuário e faça login:

```bash
# Registrar novo usuário
POST /api/v1/auth/register
{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "suasenha"
}

# Fazer login
POST /api/v1/auth/login
{
  "email": "seu@email.com",
  "password": "suasenha"
}
```

### 2. Criar URL Encurtada
```bash
POST /api/v1/urls
Authorization: Bearer seu_jwt_token
{
  "originalUrl": "https://www.exemplo.com/uma-url-muito-longa"
}
```

### 3. Acessar URL Encurtada
```bash
# O usuário clica no link encurtado
GET /api/v1/r/abc123

# Será redirecionado automaticamente para a URL original
# E o clique será contabilizado
```

### 4. Gerenciar URLs
```bash
# Listar todas as URLs do usuário
GET /api/v1/urls/all

# Ver detalhes de uma URL específica
GET /api/v1/urls/:id

# Atualizar URL (ativar/desativar)
PUT /api/v1/urls/:id

# Deletar URL
DELETE /api/v1/urls/:id
```

---

## 📖 Documentação da API

A documentação completa da API é gerada automaticamente usando Zod-OpenAPI e pode ser acessada em:

```
http://localhost:3000/docs
```

---

## 🗃️ Esquema do Banco de Dados

Para visualizar o **Modelo Entidade-Relacionamento (MER)** completo do projeto, acesse:
**[📊 Diagrama do Banco de Dados](https://drawsql.app/teams/avalanchelabs/diagrams/shortcut)**

### Tabela URLs
- `id`: Identificador único
- `originalUrl`: URL original a ser encurtada
- `shortCode`: Código curto gerado automaticamente
- `userId`: Referência ao usuário que criou
- `isActive`: Status ativo/inativo da URL
- `clicks`: Contador de cliques
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Tabela Users
- Sistema completo de usuários com autenticação
- Roles e permissões configuráveis

---

## 🔌 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Dados do usuário autenticado

### URLs (Requer autenticação)
- `POST /api/v1/urls` - Criar URL encurtada
- `GET /api/v1/urls/all` - Listar URLs do usuário
- `GET /api/v1/urls/:id` - Detalhes de uma URL
- `PUT /api/v1/urls/:id` - Atualizar URL
- `DELETE /api/v1/urls/:id` - Deletar URL

### Redirecionamento (Público)
- `GET /api/v1/r/:shortCode` - Redireciona para URL original

---

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra um issue ou envie um pull request.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
