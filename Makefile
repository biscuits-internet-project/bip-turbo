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
	turbo run migrate --filter=@bip/core

