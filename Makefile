.PHONY: dev dev-fe dev-be install install-fe install-be build build-fe build-be test lint db-migrate db-seed init reset

# Local DB setup
init:
	@if [ ! -f be/.env ]; then cp be/.env.example be/.env && echo "Created be/.env from .env.example"; fi
	docker compose up -d --wait
	make db-migrate
	make db-seed

reset:
	docker compose down -v --remove-orphans

# Run both FE and BE in dev mode (requires separate terminals on Windows)
dev:
	make -j2 dev-fe dev-be

dev-fe:
	cd fe && npm run dev

dev-be:
	cd be && npm run dev

# Install dependencies
install: install-fe install-be

install-fe:
	cd fe && npm install

install-be:
	cd be && npm install

# Build
build: build-fe build-be

build-fe:
	cd fe && npm run build

build-be:
	cd be && npm run build

# Guard tests and lint (fe only; be has no test runner yet)
test:
	cd fe && npm test

lint:
	cd fe && npm run lint

# Database
db-migrate:
	cd be && npm run db:migrate

db-seed:
	cd be && npm run db:seed

db-studio:
	cd be && npm run db:studio
