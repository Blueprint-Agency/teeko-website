.PHONY: dev dev-fe dev-be install install-fe install-be build build-fe build-be db-migrate db-seed

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

# Database
db-migrate:
	cd be && npm run db:migrate

db-seed:
	cd be && npm run db:seed

db-studio:
	cd be && npm run db:studio
