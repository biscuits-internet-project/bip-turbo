# Database connection variables - adjust as needed
DB_NAME ?= bip_development
DB_USER ?= postgres
DB_PASSWORD ?= password
PROD_DATA_PATH ?= ../data/bip.tar

install:
	bun install

build:
	bun run build

tc:
	bun run typecheck:all

lint:
	bun run lint

format:
	bun run format

clean:
	rm -rf node_modules
	rm -rf apps/web/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/web/build

web:
	cd apps/web && bun run dev

docker: 
	docker compose up -d

dev:
	bun run dev

doppler:
	doppler setup

migrate:
	cd packages/core && bun prisma:migrate:dev

migrate-no-drift-check:
	@cd packages/core && \
	ADMIN_URL="$$(doppler secrets get DATABASE_URL --plain | sed 's|postgresql://postgres:|postgresql://supabase_admin:|')" && \
	echo "Applying migrations with supabase_admin user..." && \
	for migration in $$(ls src/_shared/prisma/migrations/ | sort); do \
		echo "Applying migration: $$migration"; \
		DATABASE_URL="$$ADMIN_URL" doppler run -- bun prisma migrate resolve --applied "$$migration" --schema=./src/_shared/prisma/schema.prisma 2>/dev/null || true; \
	done && \
	echo "All migrations processed. Running final deploy to check status..." && \
	DATABASE_URL="$$ADMIN_URL" doppler run -- bun prisma migrate deploy --schema=./src/_shared/prisma/schema.prisma || echo "Deploy completed with warnings/errors"

migrate-create:
	cd packages/core && bun prisma:migrate:create

migrate-baseline:
	cd packages/core && bun prisma:migrate:baseline

db-start:
	supabase start

db-restore:
	cd packages/core && bun prisma:reset
	@echo "Restoring production data from $(PROD_DATA_PATH)..."
	@if [ ! -f $(PROD_DATA_PATH) ]; then \
		echo "Error: Production data file not found at $(PROD_DATA_PATH)"; \
		exit 1; \
	fi
	pg_restore --no-owner --no-acl --data-only -d "$$(doppler secrets get DATABASE_URL --plain)" $(PROD_DATA_PATH) || true
	@echo "Production data restored successfully."

db-load-data-dump:
	psql "$$(doppler secrets get DATABASE_URL --plain | sed 's|postgresql://postgres:|postgresql://supabase_admin:|')" -f $(PROD_DATA_PATH)

db-scrub:
	psql "$$(doppler secrets get DATABASE_URL --plain)" -f scripts/scrub.sql

db-generate:
	cd packages/core && bun prisma:generate

db-reset-prod:
	cd packages/core && bun prisma:reset

db-introspect:
	cd packages/core && bun prisma:introspect

db-studio:
	cd packages/core && bun prisma:studio

db-execute:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make db-execute FILE=path/to/file.sql"; \
		exit 1; \
	fi
	@DB_URL=$$(doppler secrets get DATABASE_URL --plain); \
	if echo "$$DB_URL" | grep -q "localhost\|127.0.0.1\|supabase"; then \
		echo "Executing SQL file: $(FILE)"; \
		psql "$$DB_URL" -f $(FILE); \
	else \
		echo "ERROR: This command can only be run against localhost/development databases"; \
		echo "Current DATABASE_URL appears to be production: $$DB_URL"; \
		exit 1; \
	fi

db-query:
	@if [ -z "$(SQL)" ]; then \
		echo "Usage: make db-query SQL=\"SELECT * FROM table\""; \
		exit 1; \
	fi
	@DB_URL=$$(doppler secrets get DATABASE_URL --plain); \
	if echo "$$DB_URL" | grep -q "localhost\|127.0.0.1\|supabase"; then \
		psql "$$DB_URL" -c "$(SQL)"; \
	else \
		echo "ERROR: This command can only be run against localhost/development databases"; \
		echo "Current DATABASE_URL appears to be production: $$DB_URL"; \
		exit 1; \
	fi

# Vector search indexing
index-songs:
	bun run index:songs

index-shows:
	bun run index:shows

index-venues:
	bun run index:venues

index-tracks:
	bun run index:tracks

index-all:
	bun run index:all
