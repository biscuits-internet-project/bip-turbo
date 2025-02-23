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

db:
	turbo run db:migrate --filter=@bip/database

db-studio:
	turbo run db:studio --filter=@bip/database

db-generate:
	turbo run db:generate --filter=@bip/database
