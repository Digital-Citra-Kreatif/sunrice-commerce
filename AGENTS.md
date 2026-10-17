# Working on Sunrice Commerce

`SPEC.md` is the source of truth for behaviour. `EXECUTION_PLAN.md` is the source of truth for structure, naming, and order. `ARCHITECTURE.md` explains the design. If they disagree, follow `SPEC.md` and record the conflict in the pull request.

## Rules

- One task per branch and pull request. Branch `task/<task-id>-<short-name>`, PR titled `[<task-id>] <name>`.
- Only start a task when all its dependencies are merged. U-tasks live in `sunrice-cms`.
- Use only Sunrice's public API (plus merged U-tasks). Missing something? Propose a U-task in the PR.
- No Composer or npm packages beyond `EXECUTION_PLAN.md` §2.
- Feature modules: always register, gate at runtime; optional connections use null implementations.
- Money is integers in minor units; never read prices or totals from the request.
- Every task ships Pest tests (Orchestra Testbench). Before opening a PR run: `composer test`, `composer lint`, `composer analyse`, and for admin frontend tasks `npm run typecheck && npm run test:frontend && npm run build`.
- Never modify migrations from a merged task — add a new migration.
- Do not implement anything listed under "Out of scope for v1" in `SPEC.md`.
- Update `docs/` and `CHANGELOG.md` when adding developer-facing API.
- Do not commit `vendor/`, `node_modules/`, or `.env`. Do commit compiled admin assets in `dist/`.

## Conventions

- PHP 8.4+, Laravel 13. Namespace `Sunrice\Commerce\` → `src/`; tests `Sunrice\Commerce\Tests\` → `tests/`. Every PHP file starts `declare(strict_types=1);`.
- Config `config/commerce.php` (key `commerce`); views `commerce::`; components `<x-commerce::…>`; tables prefixed `commerce_`.
- Permissions `commerce.<area>.<action>`; admin route names `sunrice.admin.commerce.<area>.<action>`; storefront `commerce.<name>` (+ `.locale`).
- Write operations live in single-purpose action classes `src/<Area>/Actions/` with a public `handle()`. Controllers stay thin.
- Admin JS/TS in `resources/js/admin` (TypeScript; React from `window.Sunrice`; Tailwind prefix `cm:`).

## Commands

```bash
composer test      # Pest
composer lint      # Pint (test mode)
composer format    # Pint (fix)
composer analyse   # Larastan
npm run build      # admin bundle -> dist/
vendor/bin/testbench serve   # workbench store
```
