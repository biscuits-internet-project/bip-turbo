# Database connection variables - adjust as needed
DB_NAME ?= bip_development
DB_USER ?= postgres
DB_PASSWORD ?= password
PROD_DATA_PATH ?= ../data/bip.tar
BACKUP_DIR ?= backups

install:
	bun install

build:
	bun run build

tc:
	bun run typecheck:all

typegen:
	cd apps/web && bun react-router typegen && bun run gen-root

lint:
	bun run lint

test:
	bun run test

# Run a package's tests filtered to certain files (vitest path/name substrings).
# Defaults to the core package. Examples:
#   make test-file FILES="quonfig"
#   make test-file PKG=web FILES="setlist-card"
#   make test-file PKG=core FILES="rater-weight rater-weighting"
test-file:
	@if [ -z "$(FILES)" ]; then \
		echo "Usage: make test-file [PKG=core|web|domain] FILES=\"<path-or-name substrings>\""; \
		exit 1; \
	fi
	bun run -F @bip/$(or $(PKG),core) test $(FILES)

format:
	@if [ -z "$(FILES)" ]; then \
		echo "Usage: make format FILES=\"file1.ts file2.tsx\""; \
		exit 1; \
	fi
	bunx biome check --fix $(FILES)

format-all:
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

migrate-deploy:
	cd packages/core && bun prisma:migrate:deploy

migrate-create:
	@if [ -z "$(NAME)" ]; then echo "Usage: make migrate-create NAME=add_foo_index" && exit 1; fi
	cd packages/core && bun prisma:migrate:create -- --name $(NAME)

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

recompute-pending:
	cd packages/core && doppler run -- bun run scripts/recompute-pending.ts

recompute-ratings:
	cd packages/core && QUONFIG_DATADIR=$(CURDIR)/quonfig doppler run -- bun run scripts/recompute-ratings.ts

rating-validity-eval:
	cd packages/core && doppler run -- bun run scripts/rating-validity-eval.ts

db-sync-missing-shows:
	cd packages/core && doppler run -- bun run scripts/sync-missing-shows.ts $(if $(HELP),--help) $(if $(YEARS),--years=$(YEARS)) $(if $(DRY_RUN),--dry-run) $(if $(PRUNE_GHOST_SHOWS),--prune-ghost-shows) $(if $(NO_USERS),--no-users) $(if $(FULL_USERS),--full-users) $(if $(PRUNE_USERS),--prune-users)

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

# Dump the local DB to a timestamped custom-format file. Routed through the
# Supabase db container's pg_dump so the dumper version matches the server
# (the Homebrew client is older and refuses on version mismatch).
db-backup:
	@DB_URL=$$(doppler secrets get DATABASE_URL --plain); \
	if echo "$$DB_URL" | grep -q "localhost\|127.0.0.1\|supabase"; then \
		CONTAINER=$$(docker ps --filter name=supabase_db --format '{{.Names}}' | head -1); \
		if [ -z "$$CONTAINER" ]; then echo "ERROR: Supabase db container not running. Run 'make db-start' first."; exit 1; fi; \
		mkdir -p $(BACKUP_DIR); \
		BACKUP_FILE=$(BACKUP_DIR)/bip-local-$$(date +%Y%m%d-%H%M%S).dump; \
		echo "Backing up local database via $$CONTAINER to $$BACKUP_FILE..."; \
		docker exec "$$CONTAINER" pg_dump -Fc -U postgres -d postgres > "$$BACKUP_FILE"; \
		echo "Backup complete:"; \
		ls -lh "$$BACKUP_FILE"; \
	else \
		echo "ERROR: This command can only be run against localhost/development databases"; \
		echo "Current DATABASE_URL appears to be production: $$DB_URL"; \
		exit 1; \
	fi

# Restore a db-backup dump into the local DB (drops + recreates objects).
db-restore-backup:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make db-restore-backup FILE=$(BACKUP_DIR)/bip-local-YYYYMMDD-HHMMSS.dump"; \
		exit 1; \
	fi
	@DB_URL=$$(doppler secrets get DATABASE_URL --plain); \
	if echo "$$DB_URL" | grep -q "localhost\|127.0.0.1\|supabase"; then \
		CONTAINER=$$(docker ps --filter name=supabase_db --format '{{.Names}}' | head -1); \
		if [ -z "$$CONTAINER" ]; then echo "ERROR: Supabase db container not running. Run 'make db-start' first."; exit 1; fi; \
		echo "Restoring $(FILE) into local database via $$CONTAINER..."; \
		docker exec -i "$$CONTAINER" pg_restore --no-owner --no-acl --clean --if-exists -U postgres -d postgres < $(FILE); \
		echo "Restore complete."; \
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
