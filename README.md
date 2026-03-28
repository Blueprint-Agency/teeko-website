# teeko-website

Monorepo for the Teeko website — Next.js frontend and Node.js/Express backend.

## Structure

```
teeko-website/
├── fe/   # Next.js frontend (port 5000)
└── be/   # Node.js + Express + Drizzle ORM backend (port 3000)
```

## Local Development

### Prerequisites

- Node.js 23+
- PostgreSQL running locally

### Setup

1. Copy env files and fill in values:
   ```bash
   cp fe/env.example fe/.env
   cp be/env.example be/.env
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Run database migrations:
   ```bash
   make db-migrate
   ```

4. Start both services:
   ```bash
   make dev
   ```

   Or run separately in two terminals:
   ```bash
   make dev-fe   # http://localhost:5000
   make dev-be   # http://localhost:3000
   ```

## Available Commands

| Command | Description |
|---------|-------------|
| `make dev` | Run FE + BE in dev mode |
| `make dev-fe` | Run FE only |
| `make dev-be` | Run BE only |
| `make install` | Install deps for both |
| `make build` | Build both |
| `make db-migrate` | Run database migrations |
| `make db-seed` | Seed the database |
| `make db-studio` | Open Drizzle Studio |

## CI/CD

| Branch | Environment | VPS |
|--------|-------------|-----|
| `staging` | staging | VPS1 — staging.teeko.ai |
| `main` | production | VPS2 — teeko.ai |

Workflows are path-scoped — pushing changes to `fe/` only triggers the FE deploy, and `be/` only triggers the BE deploy.

Images are published to DockerHub as:
- `blueprintagency/teeko-website-fe`
- `blueprintagency/teeko-website-be`
