# SaaS Course JWT + OWASP (API de Demonstração)

API em Node.js/Express criada para treinar conceitos de autenticação, autorização (RBAC) e exemplos práticos de vulnerabilidades/correções do OWASP Top 10. O objetivo é mostrar lado a lado rotas inseguras e suas versões seguras.

## Tecnologias
- Node.js 18+, Express, Helmet e CORS
- SQLite em memória (reset a cada `npm start`)
- bcryptjs para hashing de senhas e jsonwebtoken para JWT
- rate-limiter-flexible para proteção contra força bruta

## Executando
1. Instale dependências: `npm install`
2. Suba a API: `npm run dev` (watch) ou `npm start`
3. Acesse em `http://localhost:3000`

## Estrutura de módulos
- `src/server.js`: registra middlewares globais e monta as rotas.
- `src/db.js`: banco SQLite em memória com usuários seed (`admin/admin123`, `user/user123`).
- Autenticação (`src/modules/1-authentication`):
  - `basic.js`: registro inseguro (senha em texto) vs seguro (hash bcrypt) e login compatível com ambos.
  - `jwt.js`: login que emite JWT com `id`, `username`, `role` e expiração de 1h.
- Autorização (`src/modules/2-authorization`):
  - `rbac.js`: middleware `authenticateToken` e `authorizeRole`.
  - `routes.js`: rotas públicas, perfil autenticado e rota só para `admin`.
- OWASP Top 10 (`src/modules/3-owasp-top10`):
  - `A01-broken-access-control/idor.js`: IDOR inseguro vs acesso verificado por usuário/role.
  - `A02-cryptographic-failures/sensitive-data.js`: armazenamento de cartão em texto vs criptografado (AES-256-CBC).
  - `A03-injection/sql-injection.js`: busca vulnerável por concatenação vs preparada.
  - `A05-security-misconfig/error-handling.js`: exposição de stack trace vs erro genérico logado.
  - `A07-auth-failures/brute-force.js`: login sem proteção vs rate limit (5/min por IP).
  - `A09-logging/logging.js`: ação crítica sem auditoria vs log estruturado.

## Fluxo rápido para testar
1. Crie usuário seguro: `POST /auth/basic/register-secure` com body `{"username":"alice","password":"pwd123"}`
2. Faça login por JWT: `POST /auth/jwt/login` com o mesmo usuário → pegue o `token`.
3. Acesse rotas protegidas enviando header `Authorization: Bearer <token>`, ex.: `GET /authz/profile` ou `GET /owasp/a01/user-secure/<id>`.

## Notas de segurança
- O segredo do JWT está hardcoded para fins didáticos; em produção use variáveis de ambiente.
- Como o banco fica em memória, os dados somem a cada reinício (ótimo para testes isolados).
- As rotas marcadas como inseguras existem apenas para estudo e não devem ser usadas em produção.
