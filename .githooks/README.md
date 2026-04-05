# Git Hooks

Custom [git hooks](https://git-scm.com/docs/githooks) for this repo.

> Hooks are programs you can place in a hooks directory to trigger actions at certain points in git's execution. A non-zero exit code from a git hook aborts the operation.

## Hooks

- **`pre-commit`** — runs `bun run lint` before every commit. Fast.
- **`pre-push`** — runs `bun run typecheck:all` and `bun run test` before every push. Slower but catches broken code before it hits the remote.

## Activation

These hooks are opt-in. To enable them, run this once in the repo root:

```bash
git config core.hooksPath .githooks
```

This sets git's `core.hooksPath` to this directory instead of the default `.git/hooks`.

## Skipping a hook

Pass `--no-verify` to bypass the hook for a single operation — e.g. pushing a WIP branch where tests intentionally fail:

```bash
git push --no-verify
git commit --no-verify
```

## Adding a new hook

Place the executable at `.githooks/<hook-name>` and run `chmod a+x .githooks/<hook-name>`.
