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

db-generate:
	cd packages/core && pnpm prisma:generate

db-introspect:
	cd packages/core && pnpm prisma:introspect

db-studio:
	cd packages/core && pnpm prisma:studio
