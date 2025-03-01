# Database connection variables - adjust as needed
DB_NAME ?= bip_development
DB_USER ?= postgres
DB_PASSWORD ?= password
PROD_DATA_PATH ?= ../data/bip.tar

install:
	pnpm install

build:
	turbo run build

tc:
	turbo run typecheck

lint:
	turbo run lint

clean:
	turbo run clean

web:
	turbo run dev --filter=@bip/web

workers:
	turbo run dev --filter=@bip/workers

doppler:
	doppler setup

migrate:
	cd packages/core && pnpm prisma:migrate:dev

migrate-create:
	cd packages/core && pnpm prisma:migrate:create

migrate-baseline:
	cd packages/core && pnpm prisma:migrate:baseline

db-reset:
	cd packages/core && pnpm prisma:reset
	@echo "Restoring production data from $(PROD_DATA_PATH)..."
	@if [ ! -f $(PROD_DATA_PATH) ]; then \
		echo "Error: Production data file not found at $(PROD_DATA_PATH)"; \
		exit 1; \
	fi
	pg_restore --no-owner --no-acl --data-only -d "$$(doppler secrets get DATABASE_URL --plain)" $(PROD_DATA_PATH) || true
	@echo "Production data restored successfully."

db-generate:
	cd packages/core && pnpm prisma:generate

db-introspect:
	cd packages/core && pnpm prisma:introspect

db-studio:
	cd packages/core && pnpm prisma:studio
