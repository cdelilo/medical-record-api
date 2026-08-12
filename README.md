# Medical Record API

Backend REST para um sistema de prontuário eletrônico. A API permite que um médico autentique-se, gerencie pacientes, registre agendamentos e mantenha observações de consultas.

## Tecnologias

- TypeScript
- Node.js 22.23.2
- Express
- MySQL 8.0
- TypeORM
- Tsyringe
- Celebrate/Joi
- JWT e bcrypt
- Vitest
- Swagger/OpenAPI
- Docker Compose
- GitHub Actions, Docker Hub e Render
- ESLint, Prettier e EditorConfig

## Arquitetura

O código é organizado por módulos de domínio. Cada módulo separa rotas, controllers, services, repositories, entidades e contratos de entrada e saída. Os services concentram as regras de negócio, os repositories encapsulam o acesso ao banco com TypeORM e o Tsyringe faz a injeção de dependências. Recursos compartilhados, como configuração HTTP, banco de dados, middlewares e utilitários, ficam em `src/shared`.

O diagrama ER está disponível em [src/docs/database.md](src/docs/database.md).

## Pré-requisitos

É necessário ter o Docker com Docker Compose instalado. O ambiente de desenvolvimento, incluindo Node.js e MySQL, é iniciado pelos containers; não é necessário instalar o Node.js localmente para executar a aplicação.

## Configuração do ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Revise os valores no `.env` antes de iniciar a aplicação. As variáveis mais importantes são:

| Grupo          | Variáveis                                                                              | Finalidade                                                                                                |
| -------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Banco de dados | `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` e `MYSQL_ROOT_PASSWORD` | Configuram o MySQL e o usuário utilizado pela aplicação.                                                  |
| Seed do médico | `SEED_DOCTOR_NAME`, `SEED_DOCTOR_EMAIL` e `SEED_DOCTOR_PASSWORD`                       | Definem o perfil do médico criado automaticamente. Use o email e a senha definidos aqui para fazer login. |
| Access token   | `SECRET_TOKEN` e `EXPIRES_IN_TOKEN`                                                    | Assinam e definem a validade do token de acesso.                                                          |
| Refresh token  | `SECRET_REFRESH_TOKEN`, `EXPIRES_IN_REFRESH_TOKEN` e `EXPIRES_REFRESH_TOKEN_DAYS`      | Assinam e definem a validade do refresh token.                                                            |

Substitua os valores demonstrativos de `SECRET_TOKEN` e `SECRET_REFRESH_TOKEN` por secrets fortes e distintos. Os valores de expiração do refresh token devem permanecer coerentes entre `EXPIRES_IN_REFRESH_TOKEN` e `EXPIRES_REFRESH_TOKEN_DAYS`.

Para a aplicação dentro do Docker, `MYSQL_HOST` deve ser `mysql`. Para conectar ao banco por clientes externos, como MySQL Workbench, DBeaver ou Beekeeper Studio, use `localhost` ou `127.0.0.1` como host e utilize a porta, usuário, senha e database definidos no `.env`.

O seed é idempotente: ele cria o médico somente se ainda não existir um usuário com o email configurado. Alterar as variáveis do seed depois da primeira inicialização não altera o médico já persistido.

## Executando a aplicação

Na raiz do projeto, execute:

```bash
docker compose up
```

No primeiro início, o Docker executa automaticamente o seguinte fluxo:

1. O MySQL inicia e passa pelo healthcheck.
2. As dependências são instaladas.
3. As migrations pendentes preparam o banco de dados.
4. O seed cria o perfil do médico configurado no `.env`.
5. O servidor de desenvolvimento inicia.

Comandos úteis:

```bash
# Acompanhar os logs da API
docker compose logs -f app

# Parar os containers
docker compose down

# Remover containers e o volume do MySQL (apaga os dados persistidos)
docker compose down -v
```

## Endereços locais

| Recurso     | URL                              |
| ----------- | -------------------------------- |
| API         | `http://localhost:3000`          |
| Healthcheck | `http://localhost:3000/healthy`  |
| Swagger UI  | `http://localhost:3000/api-docs` |

## Autenticação

Faça login com as credenciais definidas em `SEED_DOCTOR_EMAIL` e `SEED_DOCTOR_PASSWORD`. O login retorna um access token e um refresh token.

- Use o access token no botão **Authorize** do Swagger UI ou no header `Authorization: Bearer <token>` para acessar Patients e Appointments.
- Use o refresh token somente nas rotas de renovação e logout.
- No Swagger UI, informe somente o valor do access token no campo de autorização, sem adicionar manualmente o prefixo `Bearer`.

## Datas e timezone

Campos `DATETIME`, como `scheduledAt` e os filtros `from` e `to` de agendamentos, devem usar o formato ISO 8601 com timezone.

```text
2026-08-09T05:00:00-03:00
```

O campo `birthDate` representa somente uma data e deve usar o formato `YYYY-MM-DD`.

## Testes, qualidade e build

Com os containers em execução, use os comandos abaixo:

```bash
# Testes unitários
docker compose exec -T app npm run test:unit

# Cobertura de testes
docker compose exec -T app npm run test:unit:coverage

# TypeScript, Prettier e ESLint
docker compose exec -T app npm run check

# Corrigir formatação e problemas corrigíveis do lint
docker compose exec -T app npm run fix

# Gerar build de produção
docker compose exec -T app npm run build
```

Caso Node.js e npm também estejam instalados localmente, `npm test` e `npm run test:coverage` são atalhos que executam os testes dentro do container da aplicação.

## VS Code e REST Client

O projeto recomenda as extensões configuradas em [.vscode/extensions.json](.vscode/extensions.json):

- ESLint
- Prettier
- EditorConfig
- REST Client

Após instalar a extensão REST Client, abra [restclient.http](restclient.http). Ajuste o payload de login para usar as credenciais configuradas no `.env`; depois copie o access token e o refresh token retornados para as variáveis `@token` e `@refreshToken` no início do arquivo antes de executar as requisições protegidas.
