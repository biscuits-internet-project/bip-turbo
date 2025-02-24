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

migrate:
	turbo run db:migrate --filter=@bip/core

generate:
	turbo run db:generate --filter=@bip/core

push:
	turbo run db:push --filter=@bip/core

pull:
	turbo run db:pull --filter=@bip/core
