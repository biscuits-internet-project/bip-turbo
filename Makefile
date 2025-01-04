install:
	pnpm install

build:
	turbo run build

web:
	turbo run dev --filter=@bip/web

workers:
	turbo run dev --filter=@bip/workers

db:
	turbo run db:migrate --filter=@bip/database

db-studio:
	turbo run db:studio --filter=@bip/database
