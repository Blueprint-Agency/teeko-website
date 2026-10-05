# teeko-website

Next.js frontend + Express backend monorepo.

Before changing anything, read [AGENTS.md](AGENTS.md) (client rules and facts),
[OPEN-ITEMS.md](OPEN-ITEMS.md) (what is blocked and why) and [PRODUCT.md](PRODUCT.md)
(what exists and what must not be invented).

```
fe/   → Next.js (port 5000)
be/   → Express + Drizzle ORM (port 3000)
```

## Setup

**Prerequisites:** Node.js 23+, Docker Desktop, `make`

```bash
make install   # install dependencies
make init      # start Postgres, migrate, seed
make dev       # run fe + be
```

## Commands

| Command | What it does |
|---|---|
| `make dev` | Run FE + BE |
| `make install` | Install deps |
| `make init` | Start DB, migrate, seed |
| `make reset` | Wipe DB container |
| `make build` | Build both |
| `make test` | Run FE guard tests (`fe/tests/guards.test.ts`) |
| `make lint` | Lint FE |
| `make db-migrate` | Run migrations |
| `make db-seed` | Seed database |
| `make db-studio` | Open Drizzle Studio |

## CI/CD

| Branch | URL |
|---|---|
| `staging` | staging.teeko.ai |
| `main` | teeko.ai |

Path-scoped deploys — `fe/` changes only trigger FE, `be/` only BE.
DockerHub: `blueprintagency/teeko-website-fe`, `blueprintagency/teeko-website-be`
