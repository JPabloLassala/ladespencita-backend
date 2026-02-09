# La Despencita Backend

Backend service built with NestJS, TypeORM, and PostgreSQL.

**Requirements**

- Node.js and Yarn
- Docker (optional for local Postgres)

**Environment**
Create a `.env` file based on `.env.example` if you use env files. Required values:

- `DATABASE_URL`
- `JWT_SECRET`
- `DEFINED_USERNAME`
- `DEFINED_PASSWORD`
- `CDN_BASE_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`

If you use Docker Compose, `DATABASE_URL` is already set for the container.

**Install**

```bash
yarn install
```

**Run (local)**

```bash
yarn dev
```

**Run (Docker)**

```bash
docker compose up --build
```

Postgres data is bound to `./assets/pgdata` via the `postgres-data` volume in `docker-compose.yml`.

**Migrations**
The TypeORM CLI uses `migrations.ts` at the repo root.

```bash
# show migrations
yarn migration:show

# run migrations
yarn migration:run

# revert last migration
yarn migration:revert
```

**Seeds**

```bash
yarn seed
```

**Tests**

```bash
yarn test
yarn test:watch
yarn test:cov
yarn test:e2e
```

**Scripts**

```bash
yarn build
yarn start
yarn start:prod
yarn lint
yarn format
```

**Project Structure**

- `src/modules/*` feature modules
- `src/common/*` shared helpers (guards, filters, decorators, constants)
- `src/infrastructure/*` external integrations (database, config, storage)
- `seeds/*` data seed scripts
- `migrations.ts` TypeORM CLI datasource
