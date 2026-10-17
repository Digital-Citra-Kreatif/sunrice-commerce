# Sunrice Commerce — Execution Plan

This plan turns `SPEC.md` and `ARCHITECTURE.md` into a working package. It is written for AI coding
agents. Each task lists its dependencies, the files to create or change, what they must contain,
and when the task is done.

- `SPEC.md` is the source of truth for behaviour.
- This plan is the source of truth for structure, naming and order.
- `ARCHITECTURE.md` explains the design behind both.

If they disagree, follow `SPEC.md` and record the conflict in the task's pull request.

---

## 0. Rules for agents

1. **Read `SPEC.md`, `ARCHITECTURE.md` and this file before starting any task.** Read §1
   Conventions every time.
2. **One task per branch and pull request.** Branch `task/<task-id>-<short-name>`, e.g.
   `task/C4.3-product-projector`. PR title `[C4.3] Product projector`.
3. **Only start a task when all its dependencies are merged.** Tasks without a dependency between
   them can run in parallel.
   - **U-tasks** live in the `sunrice-cms` repository and follow its `AGENTS.md`.
   - A commerce task that needs a U-task waits until that U-task is merged into `sunrice-cms`
     `main`. Then update the `sunrice/cms` constraint (or the pinned commit) in `composer.json`.
4. **Use only Sunrice's public API** (Sunrice `docs/packages.md`) plus merged U-tasks. If something
   is missing, don't reach into Sunrice internals: describe the needed addition in the PR and
   propose a new U-task. The documented exceptions are in `ARCHITECTURE.md` §3.
5. **Do not add Composer or npm packages that are not listed in §2.** If one seems needed, stop and
   explain why in the PR instead of adding it.
6. **Every task ships tests**, Pest with Orchestra Testbench. Before opening a PR, run:
   - `composer test` (Pest)
   - `composer lint` (Pint, test mode)
   - `composer analyse` (Larastan)
   - for admin frontend tasks: `npm run typecheck && npm run test:frontend && npm run build`, and
     commit `dist/`.
7. **Never modify a migration from a merged task.** Add a new migration instead.
8. **Feature modules: always register, gate at runtime** (`ARCHITECTURE.md` §4.3).
   - Routes, permissions, listeners, MCP tools and navigation items are registered regardless of
     the switch. Access is refused when the module is inactive.
   - Optional connections go through contracts with null implementations (§4.4).
   - Every module-owned surface is added to `FeatureMatrixTest`.
9. **Money is integers in minor units.** Never read a price, discount or total from the request
   (staff overrides are separate, permission-checked inputs).
10. **Staff writes are logged** (`ActivityRecorder`). **Public writes are rate-limited.**
11. **Keep it simple.** The `SPEC.md` principles apply. Do not implement anything listed under "Out
    of scope for v1".
12. **Update `docs/` when you add developer-facing API**: config keys, components, helpers,
    `Commerce::` methods, contracts and events. Add a line to `CHANGELOG.md` under
    `## Unreleased`.
13. **Do not commit `vendor/`, `node_modules/` or `.env`.** Do commit the compiled admin assets in
    `dist/`.

---

## 1. Conventions

| Item | Value |
| --- | --- |
| Composer package | `sunrice/commerce` |
| PHP | `^8.4` (Laravel 13); CI on 8.4 and 8.5 |
| PHP namespace | `Sunrice\Commerce\` → `src/`; tests `Sunrice\Commerce\Tests\` → `tests/` |
| Service provider | `Sunrice\Commerce\CommerceServiceProvider` (auto-discovered; extends `Spatie\LaravelPackageTools\PackageServiceProvider`) |
| Facade | `Sunrice\Commerce\Facades\Commerce` → `Sunrice\Commerce\Commerce` (singleton) |
| Config | `config/commerce.php`, key `commerce` |
| Views / components | `commerce::`; `<x-commerce::…>` |
| Translations | `resources/lang/{id,en}/{storefront,emails,statuses,validation}.php` → `commerce::…` |
| Tables | Prefix `commerce_`; `$table->id()` except reference data keyed by code; JSON cast to `array` |
| References to Sunrice/host rows | Indexed plain columns, no foreign keys (`entry_id`, `term_id`, `asset_id`, `user_id`) |
| Money | `bigInteger`, minor units; percentages in basis points; never floats |
| Permissions | `commerce.<area>.<action>` |
| Admin routes | `routes/admin.php` via `Sunrice::adminRoutes()`; URLs `{admin}/commerce/…`; names `sunrice.admin.commerce.<area>.<action>` |
| Storefront routes | Names `commerce.<name>` and `commerce.<name>.locale`; paths from `commerce.storefront.paths` |
| Inertia pages | `Commerce/<Area>/<Page>` registered by the admin bundle |
| Admin JS/TS | `resources/js/admin/` (TypeScript, React 19 types; React taken from `window.Sunrice`); Tailwind prefix `cm:` |
| Storefront assets | `stubs/theme/commerce.css`, `stubs/theme/commerce.js` (plain, no build) |
| Actions | `src/<Area>/Actions/<Verb><Noun>.php`, public `handle()`; controllers/tools/commands stay thin |
| Strict types | Every PHP file starts with `declare(strict_types=1);` |
| Events | `src/Events/`, implement `ShouldDispatchAfterCommit` |
| Tests | `tests/Feature/<Area>/…Test.php`, `tests/Unit/<Area>/…Test.php`, fixtures in `tests/Fixtures/` |

---

## 2. Approved dependencies

Verify that each package's current release supports Laravel 13 (and PHP 8.4) when you add it, and
pin to that major version.

**Composer — require**

| Package | Used for | Added in |
| --- | --- | --- |
| `php` `^8.4` | | C1.1 |
| `illuminate/contracts`, `illuminate/support` `^13.0` | | C1.1 |
| `sunrice/cms` | The CMS. Use a VCS repository `https://github.com/Digital-Citra-Kreatif/sunrice-cms` until it is tagged on Packagist | C1.1 |
| `spatie/laravel-package-tools` `^1.93` | Provider boilerplate | C1.1 |
| `inertiajs/inertia-laravel` `^3.5` | Admin pages (same constraint as Sunrice) | C3.1 |
| `spatie/laravel-permission` `^8.0` | Roles (same as Sunrice) | C2.4 |
| `laravel/mcp` `^1.0` | MCP tools (same as Sunrice) | C14.1 |
| `spatie/laravel-honeypot` `^4.7` | Public forms (same as Sunrice) | C6.2 |
| `spatie/simple-excel` `^3.10` | CSV exports (same as Sunrice) | C8.6 |
| `intervention/image` `^4.0` | Re-encoding payment proof images (same as Sunrice) | C9.3 |
| `spatie/laravel-one-time-passwords` `^1.1` | Emailed one-time sign-in codes (requires PHP 8.4) | C7.3 |
| `laravel/socialite` `^5.31` | Google sign-in | C7.4 |
| `barryvdh/laravel-dompdf` `^3.1` | PDF invoices, packing slips, quotations | C11.1 |

**Composer — require-dev**: `orchestra/testbench` `^11.0`, `pestphp/pest` `^4.0`,
`pestphp/pest-plugin-laravel` `^4.1`, `laravel/pint` `^1.0`, `larastan/larastan` `^3.0`.

**npm (admin bundle only)**:

- `typescript`, `vite`, `@vitejs/plugin-react` (classic JSX runtime);
- `@types/react`, `@types/react-dom` (types only: React itself comes from `window.Sunrice`);
- `tailwindcss` (v4) and `@tailwindcss/vite`;
- `recharts` `^3.10` and `react-is` `^19` (charts);
- `@dnd-kit/core`, `@dnd-kit/sortable` (reordering options, variants, bundle items, methods);
- `lucide-react` (icons), `clsx`, `tailwind-merge`.

**Data (vendored, not a dependency)**: Indonesian regions from `cahyadsn/wilayah` (Kepmendagri
300.2.2-2430/2025) and `cahyadsn/wilayah_kodepos`, both MIT. They are converted to CSV in
`database/data/regions/`, with the upstream licence and attribution in
`database/data/regions/NOTICE.md`.

---

## 3. Target repository layout

```
sunrice-commerce/
├── composer.json, package.json, package-lock.json, tsconfig.json, vite.config.ts
├── config/commerce.php
├── database/
│   ├── migrations/                 all package migrations (commerce_*)
│   ├── factories/                  model factories for tests
│   ├── seeders/                    CommerceRolesSeeder, DemoStoreSeeder
│   └── data/regions/               provinces.csv, cities.csv, districts.csv, villages.csv.gz, NOTICE.md
├── dist/                           committed admin bundle (admin.js, admin.css, manifest.json)
├── docs/                           developer docs
├── resources/
│   ├── js/admin/                   admin pages, field controls, components, shims
│   ├── css/admin.css               Tailwind 4 utilities for the admin bundle
│   ├── lang/{id,en}/               storefront, emails, statuses, validation
│   ├── structure/                  commerce.php (scaffold definition), pages/*.md (legal texts)
│   └── views/
│       ├── storefront/             fallback store pages and partials
│       ├── components/             <x-commerce::*> views (slot only)
│       ├── emails/                 markdown mail views
│       ├── documents/              invoice, packing slip, quotation
│       └── layouts/                minimal store layout (when the site has none)
├── routes/admin.php, storefront.php, account.php, api.php, webhooks.php
├── src/                            see ARCHITECTURE.md §2
├── stubs/
│   ├── templates/                  published to resources/views/{sunrice,commerce}
│   └── theme/                      commerce.css, commerce.js → public/commerce-theme
├── tests/                          Pest.php, TestCase.php, Feature/, Unit/, Frontend/, Fixtures/
├── workbench/                      Testbench app: User model, seeders, fake gateway/courier/loyalty
├── AGENTS.md, CLAUDE.md, README.md, CHANGELOG.md, SPEC.md, ARCHITECTURE.md, EXECUTION_PLAN.md
└── .github/workflows/tests.yml, .github/workflows/assets.yml
```

---

## 4. Phase overview and dependency graph

| Phase | Tasks | Depends on |
| --- | --- | --- |
| 0. Upstream additions to Sunrice CMS | U1–U16 (in `sunrice-cms`) | — |
| 1. Package skeleton | C1.1–C1.6 | — |
| 2. Foundations | C2.1–C2.9 | Phase 1 |
| 3. Admin shell | C3.1–C3.5 | C2.2, C2.3, C2.4; U1 for C3.3 |
| 4. Catalog | C4.1–C4.12 | Phase 2, C3.1; U4 for C4.4 |
| 5. Pricing and promotions | C5.1–C5.6 | C4.3 (C5.5 also C8.2, C9.1) |
| 6. Cart, wishlist, compare | C6.1–C6.4 | C5.1, C4.7, C2.8 |
| 7. Customers and accounts | C7.1–C7.6 | C2.4, C2.7, C6.1; U3 for C7.6 |
| 8. Orders, shipping, checkout | C8.1–C8.11 | Phases 5–7 |
| 9. Payments | C9.1–C9.3 | C8.4, C8.6 |
| 10. Digital delivery | C10.1–C10.2 | C4.12, C9.1, C11.2 |
| 11. Documents and notifications | C11.1–C11.3 | C8.6, C9.3 |
| 12. Storefront templates and polish | C12.1–C12.4 | Phases 4–11 storefront tasks |
| 13. Analytics | C13.1–C13.4 | C8.4, C3.5 |
| 14. MCP tools | C14.1–C14.2 | C8.6, C9.3 and each tool's module |
| 15. Extension SDK | C15.1–C15.2 | Phases 8–11 |
| 16. Install, docs, release | C16.1–C16.4 | All |

**Parallel work**:

- Phase 0 runs alongside Phases 1–2.
- After C4.3, Phase 5 (promotions) and Phase 7 (accounts) can run in parallel.
- C8.2 (shipping) can start as soon as C5.1 and C2.6 are merged.
- Phase 13 can start after C8.4.

```
Phase 1 ─► Phase 2 ─► Phase 3 ─► Phase 4 ─┬─► Phase 5 ─┐
                                          ├─► Phase 6 ─┼─► Phase 8 ─► Phase 9 ─► Phases 10, 11 ─► Phase 12
                                          └─► Phase 7 ─┘          └─► Phase 13, Phase 14 ─► Phase 15 ─► Phase 16
Phase 0 (sunrice-cms): U1 ─► C3.3 · U3 ─► C7.6 · U4 ─► C4.4 · others recommended (see each task)
```

---

## Phase 0 — Upstream additions to Sunrice CMS

These tasks run in the `sunrice-cms` repository, one PR each. They follow that repository's rules:

- tests, docs and a `CHANGELOG.md` line;
- rebuilt `dist/` when the admin changes;
- `window.Sunrice` API changes bump its `version`.

`ARCHITECTURE.md` §30 has the rationale and the fallbacks.

### U1 Settings tabs registry — required
**Files (sunrice-cms):**
- `src/Sunrice.php`: `addSettingsTab(string $key, string $label, string $href, string|callable|null $can = null)` and `settingsTabs($user)`.
- `src/Http/Middleware/HandleSunriceInertiaRequests.php`: share `settingsTabs` lazily.
- `resources/js/components/app/settings-tabs.tsx`: render the built-in tabs plus the registered ones; `current: string`.
- `resources/js/lib/plugin-api.ts`: export `components.SettingsTabs`.
- `docs/extending.md`: a "Settings tabs" section.

**Done when:** a registered tab shows for permitted users only, links inside the admin, and a
package page can render `SettingsTabs` with its own tab current.

### U2 Dashboard cards — recommended
**Files:**
- `Sunrice::addDashboardCard(string $name, Closure $props, string|callable|null $can = null, int $position = 100)`.
- `window.Sunrice.registerDashboardCard(name, Component)`.
- `pages/Dashboard.tsx` renders the cards with deferred props.

**Done when:** a card from a test package renders on the dashboard for permitted users, and its
props load deferred.

### U3 Users list scope, pagination and role filter — required (C7.6)
**Files:**
- `Sunrice::usersQueryUsing(callable $scope)`, applied in `UsersController@index`, the "others" list
  in the editor, and every user picker.
- The Users index paginated server-side with `TableQuery`: search name/email, filter by role.
- `pages/Users/Index.tsx` uses `DataTable`.

**Done when:** the scope hides matching users everywhere listed, and 5,000 users render a page in a
bounded number of queries.

### U4 Structure import — required (C4.4)
**Files:**
- `src/Structure/StructureImporter.php`.
- `Sunrice::importStructure(array $definition, bool $dryRun = false, bool $force = false): ImportReport`.
- `src/Console/ImportStructureCommand.php` (`sunrice:import-structure {file} {--dry-run} {--force}`).
- `docs/content-modeling.md`: the definition format.

**Behaviour:**
- Upserts by handle, in dependency order: fieldsets, blueprints, taxonomies (blueprint, hierarchy,
  routes, archive), collections (settings, blueprint, taxonomies, listing blueprint), globals,
  menus (items by target handle), forms, and draft entries (pages) by slug.
- Existing records that differ are reported, not changed, unless `force`.
- Runs `SyncPermissions`.

**Done when:** importing twice is idempotent; a changed blueprint is reported and only overwritten
with `force`; a dry run writes nothing.

### U5 Content write API — recommended (demo data, post-v1 import)
**Files:**
- `src/Content/ContentService.php`, exposed as `Sunrice::content()`: `createEntry(collection, locale, data)`, `saveDraft(entry, locale, data)`, `publish(entry, locale, ?publishAt)`, `unpublish(entry)`, `trash(entry)`. They wrap the existing actions, with validation and events.
- Documented in `docs/packages.md`.

**Done when:** a package can create and publish an entry through the service, with revisions and
events as from the admin.

### U6 MCP instructions hook — recommended (C14.1)
**Files:** `Sunrice::addMcpInstructions(string $markdown)`; `SunriceServer` appends the registered
text to its instructions.

**Done when:** an MCP initialize response contains the package's text.

### U7 Navigation: resource groups and badges — recommended (C3.2)
**Files:**
- `Navigation` honours `Resource::navigationGroup()` / `navigationIcon()`.
- `addNavigationItem(..., ?Closure $badge = null)`: a lazy count, shared with the item and shown by
  the sidebar.

**Done when:** a badge count renders, and a resource with a group appears in that group.

### U8 Package docs in the admin — recommended (C16.2)
**Files:** `Sunrice::registerDocs(string $directory, string $section)`; `DocsController` lists and
renders registered directories.

**Done when:** a package's markdown page appears under Manage → Docs in its section.

### U9 `FormSubmitted` event — recommended (C13.1)
**Files:** `src/Events/FormSubmitted.php` (form, submission), dispatched by `SubmitForm` after
storing.

**Done when:** a listener receives it once per submission.

### U10 Admin JS API v3 — recommended (C3.1, C4.5)
**Files:**
- `plugin-api.ts`:
  - `ui` adds DropdownMenu*, Popover*, Command*, Sheet*, Tooltip*, AlertDialog*, Separator,
    Skeleton and Calendar/DatePicker;
  - `components` adds AssetPicker, EntryPicker, TermPicker and SettingsTabs (U1);
  - `version: 3`.
- `DataTable`: filter types `date_range` and `search_select` (async options URL).

**Done when:** `npm run typecheck && npm run build` pass, and the docs list the new members.

### U11 Full-page cache control — recommended (C12.3)
**Files:** `Sunrice::cachePageUsing(callable $decide)`, consulted through a custom
`spatie/laravel-responsecache` profile, `fn (Request $request, ?TemplateContext $page): bool`.

**Done when:** with `full_page` on, a page the hook refuses isn't cached and others are.

### U12 Package frontend routes — recommended (C2.8)
**Files:**
- `Sunrice::frontendRoutes(Closure $routes)`: registers the group unprefixed and, for each non-main
  locale, under `/{locale}` with `SetFrontendLocale`; names of the prefixed copy get `.locale`.
- Document `Sunrice\Support\Locales` as public.

**Done when:** a package route answers at `/x` and `/en/x` with the right `app()->getLocale()`, and
`sunrice_locale_urls()` lists both.

### U13 Public captcha API — recommended (C7.2, C9.3)
**Files:** document `Sunrice\Support\Captcha::enabled()`, `::widget()` and `::verify(Request)` in
`docs/forms.md` as stable public API (add a Blade helper if missing).

**Done when:** documented and covered by a test using the provider test keys.

### U14 Public table API — recommended (C3.1)
**Files:** document `Sunrice\Admin\Table\TableQuery` and `Column` for package pages in
`docs/packages.md`, with an example controller feeding `components.DataTable`.

**Done when:** documented; a test builds DataTable props for a package model.

### U15 Package menu links — recommended (C12.1)
**Files:** `Sunrice::registerMenuLink(string $key, string $label, Closure $url)`; the menu item
editor offers registered links; `MenuBuilder` resolves them per locale.

**Done when:** a "Cart" menu item renders `/cart` in the main language and `/en/cart` in English.

### U16 Field validation context — recommended (C4.2)
**Files:** `FieldType::rules(array $field, ?FieldContext $context = null)`, where `FieldContext`
holds the entry id, collection and locale, passed by `SaveDraft` and the MCP tools. Existing types
ignore it.

**Done when:** a custom field can exclude its own entry in a uniqueness rule.

---

## Phase 1 — Package skeleton

### C1.1 Composer manifest, provider and registration API
**Depends on:** —

**Files:**
- `composer.json`:
  - `name: sunrice/commerce`, `type: library`, `license: MIT`;
  - `require` from §2 (only the C1.1 rows) and `require-dev`;
  - a VCS repository for `sunrice/cms`;
  - PSR-4 `Sunrice\\Commerce\\` → `src/` and `Sunrice\\Commerce\\Database\\Factories\\` →
    `database/factories/`; dev `Sunrice\\Commerce\\Tests\\` → `tests/` and `Workbench\\App\\` →
    `workbench/app/`;
  - `autoload.files: src/helpers.php`;
  - `extra.laravel.providers: Sunrice\\Commerce\\CommerceServiceProvider`;
    `aliases.Commerce: Sunrice\\Commerce\\Facades\\Commerce`;
  - scripts `test`, `lint`, `format`, `analyse` as in Sunrice.
- `src/CommerceServiceProvider.php`: `configurePackage()` sets the name `commerce` and registers
  the config, views, translations and migrations (`discoversMigrations()->runsMigrations()`).
  `packageRegistered()` binds `Commerce` as a singleton.
- `src/Commerce.php`: `version()`; the registration methods from `ARCHITECTURE.md` §24.1 as
  documented stubs. Each storing method is filled by the task that consumes it.
- `src/Facades/Commerce.php`.
- `src/helpers.php`: empty, with `declare(strict_types=1);`; each helper is wrapped in
  `if (! function_exists(...))`.
- `.gitignore` (as Sunrice).
- `.gitattributes`: export-ignore `tests/`, `workbench/`, `.github/`, `resources/js/`, `*.md`
  except `README.md`, the npm files and `vite.config.ts`.

**Done when:** `composer install` works, and a Testbench test asserts that Sunrice's and
commerce's providers are loaded and `Commerce::version()` returns a string.

### C1.2 Configuration file
**Depends on:** C1.1

**Files:** `config/commerce.php`. Every key has a comment. Top-level groups:

| Group | Keys |
| --- | --- |
| `catalog` | `collections` (`['products']`), `field` (`'product'`), `category_taxonomy`, `tag_taxonomy`, `brand_taxonomy`, `attribute_taxonomies` (`[]`), `max_options` (3), `max_variants` (100) |
| `auth` | `guard` (`'commerce'`), `passwords` (`'users'`) |
| `storefront` | `paths` (every path in `ARCHITECTURE.md` §22.1), `layout` (`'sunrice.layouts.app'`) |
| `cart` | `cookie`, `lifetime_days` (30), `prune_days` (30) |
| `downloads` | `disk` (`'local'`), `attachment_max_mb` (10) |
| `payments` | `proof_disk` (`'local'`), `proof_max_kb` (5120), `proof_retention_days` (365) |
| `shipping` | `couriers` (Indonesian presets with tracking URL templates), `volumetric_divisor` (6000) |
| `analytics` | `track_views` (true), `bot_user_agents` |
| `privacy` | `ip_retention_days` (365) |
| `defaults` | Defaults of every store setting section (`ARCHITECTURE.md` §5) |

`tests/Unit/ConfigTest.php`.

**Done when:** the config is publishable with `vendor:publish --tag=commerce-config` and its
defaults load in tests.

### C1.3 Test harness and workbench
**Depends on:** C1.1

**Files:**
- `phpunit.xml`.
- `tests/TestCase.php`:
  - loads Sunrice's providers (as in Sunrice's TestCase), `PermissionServiceProvider`,
    `HoneypotServiceProvider`, `McpServiceProvider`, Inertia and commerce;
  - locales `id` (main) and `en`;
  - `inertia.testing.ensure_pages_exist = false`.
- `tests/Pest.php`: helpers `actingAsSuperAdmin()`, `actingAsShopManager()`,
  `actingAsCustomer()`, `product()`, `withFeatures()`, `withoutFeatures()`,
  `setSellingMode()`. Later tasks fill in the bodies.
- `testbench.yaml`.
- `workbench/app/Models/User.php` (`HasRoles`; `HasOneTimePasswords` added in C7.3).
- `workbench/database/migrations` (users, permission tables).
- `workbench/database/seeders/DatabaseSeeder.php`: super admin `admin@example.com` / `password`,
  plus Sunrice's sample content; store data is filled in later.

**Done when:** `composer test` runs green and `vendor/bin/testbench serve` opens the Sunrice admin.

### C1.4 Code quality and CI
**Depends on:** C1.1

**Files:**
- `pint.json` (preset `laravel`).
- `phpstan.neon` (Larastan, level 6, paths `src/`, `config/`, `database/`).
- `.github/workflows/tests.yml`:
  - matrix PHP 8.4 and 8.5 × sqlite / mysql 8 / postgres 16;
  - steps: checkout, setup-php (extensions as in Sunrice, plus `gd`), Composer auth for the
    `sunrice-cms` VCS repository from a secret when it is private, `composer install`, lint,
    analyse, test.
- `.github/workflows/assets.yml`: `npm ci`, typecheck, `test:frontend`, build, then fail on
  `git diff --exit-code dist/`. It skips while `package.json` is absent.

**Done when:** CI passes on a PR.

### C1.5 Admin bundle tooling
**Depends on:** C1.1

**Files:**
- `package.json`: scripts `dev`, `build` (`tsc --noEmit && vite build`), `typecheck`,
  `test:frontend` (`node --test tests/Frontend/*.test.mjs`).
- `vite.config.ts`:
  - library mode, entry `resources/js/admin/main.tsx`, output `dist/admin.js` (ES module) and
    `dist/admin.css` plus `manifest.json`;
  - aliases `react`, `react-dom`, `react/jsx-runtime` → `resources/js/admin/shims/*.ts` (which
    re-export `window.Sunrice.React` / `ReactDOM`);
  - `@` → `resources/js/admin`.
- `tsconfig.json` (strict).
- `resources/css/admin.css`: `@import "tailwindcss/theme"` and `"tailwindcss/utilities"` with
  `prefix(cm)`, no preflight; `@theme inline` tokens mapped to Sunrice's CSS variables.
- `resources/js/admin/main.tsx`:
  - installs `window.SunriceCommerce` (version 1) and drains `window.SunriceCommerceQueue`;
  - registers pages and fields from `pages/` and `fields/` (empty registries for now).
- Provider:
  - `Sunrice::registerAdminScript(asset('vendor/commerce/admin.js').'?v='.$hash)` and
    `registerAdminStyle(...)`, where the hash comes from `dist/manifest.json` (read lazily, cached
    per deploy);
  - publishes tag `commerce-assets` (`dist` → `public/vendor/commerce`).
- `src/Console/PublishAssetsCommand.php` (`commerce:publish-assets`).

**Done when:** `npm run build` produces `dist/` without bundling React, the admin loads the script
(feature test asserts the tag in the Inertia root view), and a dummy page registered through
`window.Sunrice.registerPage` renders in the workbench.

### C1.6 Agent and contributor guides
**Depends on:** C1.1

**Files:**
- `AGENTS.md`, `CLAUDE.md` (`See AGENTS.md.`), `README.md`: exist from the planning PR; update the
  commands as tooling lands.
- `CHANGELOG.md` with `## Unreleased`.

**Done when:** the files exist and match this plan.

---

## Phase 2 — Foundations

### C2.1 Money and formatting
**Depends on:** C1.2

**Files:**
- `src/Support/Money.php`: an immutable `int $amount` value with `add`, `subtract`, `multiply`
  and `percent(int $basisPoints)` (half up), plus `isZero` and `isNegative`.
- `src/Support/MoneyFormatter.php`: symbol, position, separators and decimals from store settings
  (defaults Rp, left, no space, `.` thousands, `,` decimal, 0 decimals); `format()` and `parse()`.
- `src/Support/Allocator.php`: `proportional(int $total, array $weights): array`, by largest
  remainder.
- Helper `commerce_money(int $amount): string`.
- `tests/Unit/Support/*`.

**Done when:** tests cover formatting variants, parsing, negative amounts, half-up rounding, and
allocations that always sum to the total (including zero weights).

### C2.2 Store settings
**Depends on:** C1.2

**Files:**
- `src/Settings/StoreSettings.php`: reads `Setting::get('commerce')` over config defaults,
  cached under `commerce:settings`; `get(string $key)` and `section(string $key)`.
- `src/Settings/SettingsSection.php`: key, label, permission, feature, `schema()`, `rules()`,
  `page()`.
- `src/Settings/SettingsRegistry.php`.
- `src/Settings/Actions/SaveStoreSettings.php`: validates, applies cross-checks through registered
  checkers, refuses locked keys (currency) once an order exists (the check is wired in C8.1),
  stores, clears the cache, dispatches `StoreSettingsSaved` and logs to the activity log.
- `Commerce::registerSettingsSection()`.

**Done when:** tests cover defaults, overrides, cache invalidation, section validation and a
cross-check refusal.

### C2.3 Feature modules
**Depends on:** C2.2

**Files:**
- `src/Features/Feature.php`, `FeatureRegistry.php`, and `Features.php` (the resolver with modes and
  `modeRequires`, per-request memo, `explain()`).
- `src/Features/BuiltinFeatures.php`: every module in the SPEC table, with groups, requirements,
  modes and defaults.
- `src/Features/Actions/ToggleFeature.php`: refusal rules (e.g. `payments` off in Online store
  mode); returns the features that become inactive; dispatches `FeatureToggled`.
- `src/Features/Http/EnsureFeatureActive.php` (route middleware alias `commerce.feature`, 404 when
  inactive).
- Blade `@commerceFeature`.
- `src/Features/FeatureGatedPolicy.php`.
- `src/Listeners/Concerns/RunsWhenActive.php`.
- `src/Features/BindsFeatureImplementations.php`: helper binding a contract to its active or null
  implementation (`ARCHITECTURE.md` §4.4).
- Helper `commerce_feature(string $key): bool`.
- `tests/Feature/Features/*`, including `FeatureGraphTest` (no cycles; every required key exists).

**Done when:** tests cover a resolution table across modes, cascading inactivity without changing
stored switches, the refusal rules, middleware 404 and the Blade directive.

### C2.4 Permissions and roles
**Depends on:** C1.3

**Files:**
- `src/Permissions/CommercePermissions.php`: every permission from SPEC § Permission matrix, with
  labels and groups ("Store: Orders", …), registered in `boot()` through
  `Sunrice::registerPermission()`.
- `database/seeders/CommerceRolesSeeder.php`:
  - Shop Manager and Customer, using Sunrice's `RolesSeeder::match()` patterns plus entry and term
    permissions resolved by the product collection and taxonomy ids;
  - Administrator gets `commerce.*`.
- `src/Console/SeedRolesCommand.php` (`commerce:seed-roles`).

**Done when:** after `sunrice:sync-permissions` the permissions exist and show in the role editor
groups; re-running the seeder only adds; a Shop Manager can open the admin, a Customer can't.

### C2.5 Sequences and numbering
**Depends on:** C1.3

**Files:**
- Migration `create_commerce_sequences_table`.
- `src/Support/Sequences.php` (`next(string $key)` with `lockForUpdate`, creating the row if
  missing).
- `src/Support/NumberFormat.php` (tokens `{Y} {y} {m} {d} {seq} {seq:N}`; `keyFor(reset)`).
- `Commerce::orderNumberUsing()`, stored for C8.1.

**Done when:** tests cover token rendering, every reset rule, and that numbers never repeat. On
MySQL and Postgres, two connections incrementing in overlapping transactions get distinct values.

### C2.6 Indonesian regions
**Depends on:** C1.3

**Files:**
- Migrations `create_commerce_regions_table` (primary key `code`) and
  `create_commerce_region_mappings_table`.
- `database/data/regions/{provinces,cities,districts}.csv` and `villages.csv.gz`, with
  `code,parent_code,name,kind,postal_code`.
- `database/data/regions/NOTICE.md`: the source decree, upstream repositories, MIT licence text and
  conversion date.
- `bin/build-regions.php`: the documented converter from the upstream SQL to these CSVs, run by
  maintainers, not at install.
- `src/Regions/Region.php` (model), `RegionImporter.php` (levels; upsert; marks missing codes
  inactive; records the dataset version), `Countries.php` (ISO 3166 list in
  `resources/data/countries.php`), `RegionMapping.php`.
- `src/Console/ImportRegionsCommand.php` (`commerce:regions:import {--level=district} {--force}`).

**Done when:** importing a fixture subset twice is idempotent; a removed code becomes inactive, not
deleted; levels limit what is imported; counts on the full data match 38 / 514 / 7,285 / 83,762
(one test reads the CSV headers and row counts, without a database).

### C2.7 Addresses and phones
**Depends on:** C2.6

**Files:**
- `src/Support/Address.php`: value object with codes and names, `fromArray()`, `toArray()`,
  `format()` per country, `regionCodes()`.
- `src/Support/AddressRules.php`: validation; for Indonesia, the codes must exist, be active and
  chain province → city → district → village; required levels come from settings.
- `src/Support/Phone.php`: normalizes to E.164 with country `ID` as the default (`08…` → `+628…`,
  `628…` → `+628…`).

**Done when:** tests cover a valid chain, a broken chain, an inactive code, a non-ID address and
phone normalization cases.

### C2.8 Storefront routing foundation
**Depends on:** C1.2; uses U12 when merged.

**Files:**
- `src/Commerce.php::localizedRoutes(Closure)`: registers the group unprefixed and under each
  non-main locale with `SetFrontendLocale`, names suffixed `.locale`. It delegates to
  `Sunrice::frontendRoutes()` when U12 is available.
- `routes/storefront.php`, `routes/account.php`, `routes/api.php`, `routes/webhooks.php`
  (skeletons).
- Helper `commerce_url(string $name, array $params = [])`.
- `src/Http/Middleware/NoIndex.php`.
- Body classes via `Sunrice::bodyClassUsing()`.
- `resources/views/layouts/store.blade.php`: minimal layout used when `commerce.storefront.layout`
  doesn't exist.
- `src/View/Components/Slot.php` (`<x-commerce::slot>`) and `Commerce::registerStorefrontSlot()`.
- The first route: `GET {api}/regions?parent=` (JSON, cached by dataset version, long cache
  headers).

**Done when:** tests show `/commerce/api/regions` and `/en/commerce/api/regions` answering with
the right locale, `commerce_url()` picking the locale variant, `sunrice_locale_urls()` listing both
on a store page, and a registered slot partial rendering.

### C2.9 Activity, health checks and the tick
**Depends on:** C2.3

**Files:**
- `src/Support/ActivityRecorder.php`: wraps Sunrice's `ActivityLogger::record()` with commerce
  types.
- `src/Health/HealthCheck.php` (contract: `key`, `label`, `run(): HealthResult`), `HealthRegistry`,
  and the first checks: mail, queue, scheduler heartbeat.
- `src/Console/DoctorCommand.php` (`commerce:doctor`).
- `src/Console/TickCommand.php` (`commerce:tick`): records the heartbeat; later tasks add steps
  through `Commerce::onTick()` (internal).
- `src/Console/PruneCommand.php` (`commerce:prune`), with the same step mechanism.
- Schedule registration: tick every minute, prune daily.
- `Commerce::registerHealthCheck()`.

**Done when:** tests show `commerce:doctor` failing on a failing check, the tick updating the
heartbeat, and the scheduler check warning when it's stale.

---

## Phase 3 — Admin shell

### C3.1 Admin foundation
**Depends on:** C1.5, C2.2, C2.3; uses U10 and U14 when merged.

**Files:**
- `routes/admin.php`, loaded with `Sunrice::adminRoutes()`.
- `src/Http/Controllers/Admin/Controller.php` (base): `authorizeFeature()`, `tableProps()`
  (TableQuery → DataTable props).
- `src/Admin/SchemaForm.php`: a PHP builder for field schemas plus values, errors and an action URL;
  validated on the server.
- React:
  - pages `Commerce/Shared/SchemaForm`;
  - components `PageHeader`, `SectionNav`, `StatusBadge`, `MoneyInput`, `EmptyState`;
  - field controls `commerce_money`, `commerce_datetime_range`.
- PHP field types `MoneyField` and `DateTimeRangeField` (`Sunrice::registerField`).
- `tests/Frontend/money.test.mjs`.

**Done when:** a sample schema form saves through the server with validation errors shown, and the
field controls render in Sunrice's FieldRenderer.

### C3.2 Shop navigation
**Depends on:** C3.1, C2.4; uses U7 when merged.

**Files:** `src/Admin/ShopNavigation.php`. It registers every Shop item with
`Sunrice::addNavigationItem()`, each with `can` combining feature and permission, and with badges
(U7) for orders to process and confirmations waiting. `navigationUsing()` keeps the Shop group
first after Content.

**Done when:** tests assert which items a Shop Manager, an Editor and a Customer see, and that an
inactive module's item disappears.

### C3.3 Settings → Store
**Depends on:** C3.1, U1, C2.6 (region picker)

**Files:**
- `Sunrice::addSettingsTab('store', 'Store', 'commerce/settings', ...)`.
- `src/Http/Controllers/Admin/SettingsController.php` (show and update a section).
- Built-in sections in `src/Settings/Sections/`:
  - **General**: store identity, logo, address (region picker), email, phone, WhatsApp numbers and
    rotation, currency format (locked after the first order), units, selling mode with
    cross-checks, pause orders and its message;
  - **Catalog**: price visibility, catalog call-to-action, stock display, new badge days,
    attribute taxonomies, compare fields;
  - **Checkout**: fields and requirements, guest/account options, terms page, minimum order,
    order number format;
  - **Accounts**: registration, verification, customer roles, code minutes;
  - **Documents**: invoice details, numbering, when invoice numbers are assigned.

  Sections owned by later modules are added by their tasks.
- Field control `commerce_region` (country → province → city → district picker; reads
  `{api}/regions`).
- Page `Commerce/Settings/Section`, rendered with `SettingsTabs` (`current = 'store'`) and the
  section menu.

**Done when:** each section saves for users with its permission and is refused (403) without it;
selling-mode cross-checks refuse invalid saves; changes appear in the activity log.

### C3.4 Features page
**Depends on:** C3.3

**Files:**
- `src/Http/Controllers/Admin/FeaturesController.php`.
- Page `Commerce/Settings/Features`: grouped switches showing requirements, dependents, mode
  availability and "Off — needs X". Switching off something others need asks for confirmation.
  Uses `ToggleFeature`.

**Done when:** toggling through the page matches the resolver tests, and a refused toggle shows
its reason.

### C3.5 Store dashboard skeleton
**Depends on:** C3.2, C2.9

**Files:** `src/Http/Controllers/Admin/DashboardController.php` and page `Commerce/Dashboard`:
the setup checklist (computed from the store state), health results, and empty KPI and to-do areas
(filled by C13.2), with Inertia deferred props.

**Done when:** a fresh install shows the checklist and health warnings; the page needs
`commerce.dashboard.view`.

---

## Phase 4 — Catalog

### C4.1 Catalog schema and models
**Depends on:** C1.3

**Files:**
- Migrations, in order:
  `create_commerce_products_table`, `create_commerce_product_options_table`,
  `create_commerce_product_option_values_table`, `create_commerce_variants_table`,
  `create_commerce_variant_option_values_table`, `create_commerce_bundle_items_table`,
  `create_commerce_price_tiers_table`, `create_commerce_download_files_table`,
  `create_commerce_stock_movements_table`.
  Columns as in `ARCHITECTURE.md` §6.1.
- Models in `src/Catalog/Models/`: `Product`, `ProductOption`, `ProductOptionValue`, `Variant`
  (SoftDeletes), `BundleItem`, `PriceTier`, `DownloadFile`, `StockMovement`. Each has its
  relations, casts and an `entry()` resolver through Sunrice's `Entry` model by id.
- Factories.

**Done when:** factories build a variable product with options and variants, and relationship tests
pass.

### C4.2 Product data field type
**Depends on:** C4.1; uses U16 when merged.

**Files:**
- `src/Catalog/ProductField.php` (`commerce_product`), with:
  - `rules()`: structure, enums, limits, money, option-combination uniqueness, SKU uniqueness
    (`ARCHITECTURE.md` §7.1), bundle component checks;
  - `normalize()`: ULIDs, defaults, dropping unknown keys, the simple-product invariant;
  - `defaultValue()`, `references()`;
  - `hydrate()`: returns a `ProductData` DTO;
  - `translatableByDefault() = false`.
- `src/Catalog/ProductData.php`, a typed reader of the value.
- Registered in `boot()`.
- With `variants` inactive, the rules accept only `simple` and `bundle`; with `bundles` inactive,
  only `simple` and `variable`.

**Done when:** unit tests cover valid and invalid values for each type, normalization (stable ids
kept, new ids added), SKU conflicts, and limits.

### C4.3 Product projection
**Depends on:** C4.2

**Files:**
- `src/Catalog/ProductProjector.php`: `sync(Entry)`, `map(array $value): ProjectedProduct` (in
  memory, used for preview), `remove(int $entryId)`.
- `src/Catalog/PriceIndex.php`: `refresh(Product)`, `refreshStock(Product)`.
- Listeners on Sunrice's `EntryPublished` (sync) and `EntryDeleted` (remove when force-deleted),
  for product collections only.
- `src/Console/SyncProductsCommand.php` (`commerce:sync-products {--entry=*}`).
- Events `ProductSynced` and `ProductSyncFailed`.

**Done when:** tests cover that:
- publishing creates rows, and publishing a changed value updates them in place (same variant ids);
- removing a variant soft-deletes it, and adding it back restores it;
- `initial_stock` applies only once;
- an unchanged hash is skipped;
- a failure sets `sync_status = failed` without breaking the publish request;
- saving a draft changes nothing.

### C4.4 Store structure scaffold
**Depends on:** C4.2, U4

**Files:**
- `resources/structure/commerce.php`: the definition from SPEC § Installation and scaffolding —
  collection, blueprints (product, product_category, brand), taxonomies, the `product_inquiry`
  form, the `shop` menu and the legal pages.
- `resources/structure/pages/{privacy,terms,returns,shipping}.{id,en}.md`: starter texts.
- `src/Catalog/Actions/ScaffoldStore.php`, calling `Sunrice::importStructure()`.
- `src/Console/ScaffoldCommand.php` (`commerce:scaffold {--dry-run} {--force}`).
- The config handles from C1.2 point at the created structure.

**Done when:** scaffolding a fresh workbench creates everything, a second run reports "nothing to
do", a changed product blueprint is reported and not overwritten (overwritten with `--force`), and
legal pages are created only when a `pages` collection exists.

### C4.5 Product data editor (admin control)
**Depends on:** C4.2, C3.1; uses U10 when merged.

**Files:**
- `resources/js/admin/fields/product/`: the `commerce_product` control, registered with
  `window.Sunrice.registerField`, with tabs:
  - **General**: type, purchase mode, external links with presets, shipping/downloadable flags,
    featured, tax class;
  - **Variants**: options (custom, or a global attribute taxonomy using Sunrice's `api/terms`), the
    combination generator and a variant grid editor with SKU, price, compare-at, cost, image
    (Sunrice asset picker), active and quantity rules;
  - **Shipping**: weight and dimensions;
  - **Advanced**: barcode, minimum, maximum and step.

  Reordering uses dnd-kit. The control also shows the last sync error and runs a live SKU check.
  It supports tab extension through `SunriceCommerce.registerProductTab()`.
- `src/Http/Controllers/Admin/ProductApiController.php`: `GET api/sku-check`, plus
  `GET api/products/{entry}` (sync status, live stock).
- `tests/Frontend/variants.test.mjs`: combination generation, matching a selection to a variant.

**Done when:** in the workbench, an editor creates a variable product, saves a draft, publishes,
and sees the projected rows (feature test through Sunrice's entry endpoints); typecheck and build
pass.

### C4.6 Purchase modes, calls-to-action and price visibility
**Depends on:** C4.3, C2.8, C2.3

**Files:**
- `src/Catalog/PurchaseModes.php`: the pure resolver (`ARCHITECTURE.md` §7.3).
- `src/Catalog/PriceVisibility.php`.
- `src/Catalog/CallToAction.php`: inquiry link to the `product_inquiry` form with product context,
  WhatsApp link with rotation and the per-language template, external links.
- `src/Catalog/Catalog.php::check()` with the reason codes. Stock and sale checks go through
  contracts bound to null implementations until C4.8 and C5.3.
- The `/go/{type}/{product}` redirect route; it counts through the `Tracking` contract (null until
  C13.1) and allows only the product's own targets.
- The `Inventory` and `Tracking` contracts with their null implementations.

**Done when:** tests cover the mode × product purchase mode table, each price visibility option
with guests, signed-in customers and roles, WhatsApp rotation, the open-redirect guard, and a
`not_published` result for a draft, scheduled, trashed or hidden-collection entry.

### C4.7 Product views and product pages
**Depends on:** C4.6

**Files:**
- `src/Catalog/ProductView.php`, `ProductViewFactory.php` (`ARCHITECTURE.md` §7.4; tiers and sale
  data through providers added later).
- Helper `commerce_product($entry)`.
- Components `<x-commerce::product>` and `<x-commerce::price>`.
- The template fallback hook (`Sunrice::resolveTemplateUsing`).
- `resources/views/storefront/product.blade.php` and partials `price`, `add-to-cart` (a form
  posting to the cart route; the button shows only when the module is active), `variant-picker`,
  `stock`, `cta`, `structured-data` (JSON-LD, without prices when they are hidden).
- Preview support.

**Done when:** tests show a product page rendering through the fallback hook and through a published
app template, a hidden price leaving no price in the HTML or JSON-LD, preview showing draft prices,
and a listing of 24 cards using a constant number of queries.

### C4.8 Inventory
**Depends on:** C4.3, C3.1

**Files:**
- `src/Inventory/DatabaseInventory.php` (atomic reserve, release, adjust; movements; statuses;
  threshold events) and `NullInventory`, bound by feature.
- `src/Inventory/Actions/AdjustStock.php`.
- Admin `InventoryController` and page `Commerce/Inventory/Index` (DataTable of variants, inline
  adjust, history drawer).
- Product editor Inventory tab: live stock read-only, Adjust dialog, track/backorders/threshold
  fields.
- Catalog settings: stock display and hiding out-of-stock items.
- Events `StockChanged`, `StockLow`, `StockOut`, `StockBackIn`.

**Done when:** tests show reserve refusing beyond stock (and allowing with backorders), release
being idempotent, movements recorded with users, events fired once per threshold crossing, and the
inventory page requiring `commerce.inventory.*`.

### C4.9 Listings, filters and term pages
**Depends on:** C4.7

**Files:**
- `src/Catalog/ProductQuery.php` (`ARCHITECTURE.md` §7.5).
- Components `<x-commerce::products>` and `<x-commerce::product-filter>`.
- Fallback views `storefront/shop`, `category`, `brand`, `tag` and `brands` (brand index route
  `commerce.brands`), and partials `product-card`, `filters`, `pagination`.
- Facet caching under the catalog version (`src/Catalog/CatalogVersion.php`).

**Done when:** tests cover every filter and sort, facet counts excluding their own filter, SKU
search, price filters disappearing when prices are hidden, query budgets, and the brand page
listing only that brand.

### C4.10 Shop → Products admin list
**Depends on:** C4.3, C3.1

**Files:** `src/Http/Controllers/Admin/ProductsController.php` and page `Commerce/Products/Index`:
- columns, filters and search from SPEC § Products;
- Sunrice status from its entry query;
- bulk actions (featured, stock status);
- rows open Sunrice's entry editor; "New product" goes to Sunrice's create page.

**Done when:** tests cover the filters, the bulk actions with permissions, and a sync-failed badge.

### C4.11 Bundles
**Depends on:** C4.5, C4.8

**Files:**
- `src/Catalog/Bundles.php`: price (fixed / sum minus percent / sum minus amount), availability
  (minimum component stock ÷ quantity), weight, `explode(Variant, qty)` for reservations and order
  items.
- `ProductView` and `Catalog::check()` integration.
- Product editor Bundle tab (variant picker field control `commerce_variant_picker`, quantities,
  pricing).

**Done when:** tests cover each pricing mode, availability following component stock, a component
being unpublished making the bundle unavailable, and the refusal of nested bundles.

### C4.12 Digital files in product data
**Depends on:** C4.5

**Files:**
- `src/Http/Controllers/Admin/DownloadUploadController.php`: uploads to the private
  `commerce.downloads.disk` as unattached `DownloadFile` rows.
- Projection attaches the referenced files and detaches the rest.
- Product editor Digital tab: files and links per product or variant; delivery modes, limit and
  expiry.
- Prune of unattached files older than 7 days.

**Done when:** tests show upload, attach on publish, detach keeping the row, prune, and that a file
can't be fetched by any public URL.

---

## Phase 5 — Pricing and promotions

### C5.1 Pricing engine core
**Depends on:** C2.1, C4.3

**Files:**
- `src/Pricing/PricingContext.php`, `Calculator.php`, `CalculationState.php`, `CalcLine.php`,
  `Adjustment.php`, `PriceCandidate.php`.
- Contracts `PriceCandidateProvider`, `DiscountProvider`, `CalculationStage`.
- Stages `ResolveLines`, `UnitPrices`, `Subtotals`, `Discounts`, `Shipping` (null), `Fees`,
  `Taxes` (null), `Totals`.
- Provider `BasePrice` (bundles via C4.11).
- `CalculationState::hash()`.
- `Commerce::registerPriceCandidateProvider()`, `registerDiscountProvider()`,
  `registerCalculationStage()`.
- `tests/Fixtures/pricing/*.php` and `tests/Unit/Pricing/ScenariosTest.php` (the runner).

**Done when:** scenarios cover base prices, quantities, removed lines with notices, totals never
negative, and hash stability (same input same hash, any price change a different hash).

### C5.2 Product tiers and pricing rules
**Depends on:** C5.1, C3.1, C4.5

**Files:**
- Migrations `create_commerce_price_rules_table` and `create_commerce_price_rule_targets_table`.
- Models; `src/Promotions/PriceRules/RuleMatcher.php`.
- Providers `ProductTierPrice` and `PriceRulePrice` (quantity bases; category descendants).
- Admin pages `Commerce/PricingRules/Index` and `Edit` (schema form plus a targets picker).
- Product editor Bulk pricing tab.
- `ProductView` tier table for the visitor.
- Feature `pricing_rules` gates them.

**Done when:** scenarios cover best price wins, role-only rules, each quantity basis, subcategory
targets and date windows; the product page shows the visitor's tier table.

### C5.3 Flash sales
**Depends on:** C5.1, C3.1, C2.8

**Files:**
- Migrations `create_commerce_flash_sales_table` and `create_commerce_flash_sale_items_table`.
- Models; `src/Promotions/FlashSales/ActiveSales.php`.
- Provider `FlashSalePrice` (quantity cap, per-customer limit).
- `FlashSaleReservations`: `reserve`/`release`, used by C8.4 and C8.5.
- The overlap validator.
- Admin pages `Commerce/FlashSales/Index` and `Edit` (items via `commerce_variant_picker`).
- Storefront: `flash-sale` page and per-sale page, `<x-commerce::flash-sale>`, countdown and
  progress data in `ProductView`.
- Tick step for boundaries (price index, catalog version, events).

**Done when:** scenarios cover a sale starting and ending, a cap running out, the per-customer limit
refusing extra quantity, overlap refused on save, reservations being atomic, and the tick firing
`FlashSaleStarted` and `FlashSaleEnded` once each.

### C5.4 Vouchers and automatic discounts
**Depends on:** C5.1, C3.1

**Files:**
- Migrations `create_commerce_vouchers_table`, `create_commerce_voucher_targets_table`,
  `create_commerce_voucher_customers_table`, `create_commerce_voucher_redemptions_table`.
- Models; `src/Promotions/Vouchers/VoucherEligibility.php`, `VoucherDiscountProvider`,
  `AutomaticDiscountProvider`.
- Types `percent` (with max), `fixed_cart` and `fixed_item`.
- Conditions: dates, subtotals with their basis, quantity, include/exclude targets, sale exclusion,
  audience including first order.
- Limits with `VoucherRedemptions::redeem` / `release` (atomic).
- Combination rules; messages in `lang/{id,en}/validation.php`; rate limiter `commerce-voucher`.
- Admin pages `Commerce/Vouchers/Index` (usage stats) and `Edit`.

**Done when:** scenarios cover each type and condition, allocations summing exactly, every
refusal message, combination rules, limits under the lock, and release on cancel (wired in C8.5).

### C5.5 Shipping and payment conditions, free shipping, buy X get Y
**Depends on:** C5.4, C8.2, C9.1

**Files:**
- Type `free_shipping` in the `ShippingDiscounts` stage.
- Conditions for destinations, payment methods and shipping methods (evaluated once known; the
  cart shows the "applies at checkout if …" note).
- Type `buy_x_get_y`.
- Voucher editor fields for these.

**Done when:** scenarios cover free shipping capped by an amount, method and destination
conditions, and BXGY with mixed prices (cheapest first) and repeated sets.

### C5.6 Taxes
**Depends on:** C5.1, C3.3

**Files:**
- Migration `create_commerce_tax_rates_table`.
- `src/Taxes/TableRateTaxCalculator.php` and `NullTaxCalculator`, bound by feature.
- Settings section Taxes (classes, inclusive/exclusive, display, basis) and rates management.
- `ProductView` tax suffix.

**Done when:** scenarios cover inclusive and exclusive prices, a province-specific rate, compound
rates, shipping tax and per-line rounding; with `taxes` off, tax is zero everywhere.

---

## Phase 6 — Cart, wishlist, compare

### C6.1 Cart domain
**Depends on:** C5.1, C4.6

**Files:**
- Migrations `create_commerce_carts_table` and `create_commerce_cart_items_table`.
- Models; `src/Cart/CartManager.php` (cookie, lazy creation, current cart, merge on sign-in);
  `CartView`.
- Actions `AddToCart`, `UpdateCartItem`, `RemoveCartItem`, `ApplyVoucher`, `RemoveVoucher`,
  `UpdateCheckoutData`, `MergeCarts`.
- Events `CartItemAdded`, `CartItemUpdated`, `CartItemRemoved`, `CartMerged`, `VoucherApplied`,
  `VoucherRemoved`.
- Prune step.

**Done when:** tests show adding validating through `Catalog::check()` (each reason refused), merge
rules, price-change notices, and pruning.

### C6.2 Cart pages and mini cart
**Depends on:** C6.1, C2.8, C4.7

**Files:**
- Routes: cart page; forms for add, update, remove and voucher.
- JSON `{api}/cart` (GET, POST items, PATCH, DELETE, vouchers), throttled `commerce-cart`, with
  honeypot on form posts.
- Components `<x-commerce::cart>` and `<x-commerce::mini-cart>`.
- Views `storefront/cart` and partials `mini-cart`, `cart-lines`, `totals`.
- Cross-sells.
- `stubs/theme/commerce.js` (cart part): AJAX add-to-cart and mini-cart refresh.

**Done when:** tests show the no-JS flows (redirects with flash messages) and the JSON flows,
CSRF required, 404 when `cart` is inactive, and the voucher field hidden when `vouchers` is
inactive.

### C6.3 Wishlist
**Depends on:** C4.7, C2.8

**Files:**
- Migrations `create_commerce_wishlists_table` and `create_commerce_wishlist_items_table`.
- Models, actions (add, remove, share, merge on sign-in, wired in C7.1), routes, page and shared
  page, `<x-commerce::wishlist-button>`, 200-item limit.

**Done when:** tests show guest and customer wishlists, merge, share-link read-only access, and the
limit.

### C6.4 Compare
**Depends on:** C4.7

**Files:** a session list (`src/Cart/CompareList.php`), routes, `storefront/compare` view,
`<x-commerce::compare-button>`, compare fields from Catalog settings, and the maximum number of
products.

**Done when:** tests show add/remove, the maximum enforced, specifications matched by label, and
hidden prices respected.

---

## Phase 7 — Customers and accounts

### C7.1 Customer guard, customers and addresses
**Depends on:** C2.4, C2.7, C6.1

**Files:**
- Guard registration in `register()` (`ARCHITECTURE.md` §16.1).
- Migrations `create_commerce_customers_table`, `create_commerce_addresses_table`,
  `create_commerce_social_accounts_table`.
- Models `Customer` and `CustomerAddress`.
- `src/Customers/CurrentCustomer.php`, bound by `accounts`.
- Middleware `commerce.auth`.
- `src/Customers/Actions/AssignCustomerRole.php`.
- `LinkGuestOrders` (filled in once orders exist, C8.4).
- Sign-in listeners merging carts and wishlists.

**Done when:** tests show the customer guard signing in without opening `/cms` (403 or redirect), an
admin sign-in not signing in the storefront, roles working with `can()` under the commerce guard,
and the merges happening on sign-in.

### C7.2 Password accounts
**Depends on:** C7.1, C2.8; uses U13 when merged.

**Files:**
- `src/Http/Controllers/Account/{Register,Login,Logout,ForgotPassword,ResetPassword,VerifyEmail}Controller.php`.
- Actions; throttles `commerce-login` and `commerce-register`; honeypot; captcha (U13).
- Notifications `CustomerResetPassword`, `VerifyCustomerEmail` and `WelcomeCustomer` (basic
  templates; C11.2 adds settings).
- Views `storefront/account/{login,register,forgot-password,reset-password}`.
- Logout regenerating the session without invalidating it.

**Done when:** tests cover registration on and off, verification required, throttling, reset by
email, no account enumeration, and that logging out of the storefront keeps the admin session.

### C7.3 One-time code sign-in
**Depends on:** C7.2

**Files:**
- Add `spatie/laravel-one-time-passwords`.
- `src/Customers/Auth/EnsureUserModelTraits.php`: adds `HasOneTimePasswords` to the host user
  model like `sunrice:install` adds `HasRoles`; used by `commerce:install` (C16.1).
- Actions `RequestLoginCode` and `ConsumeLoginCode` (`ARCHITECTURE.md` §16.2: `consumeOneTimePassword()`
  plus `Auth::guard('commerce')->login()`, never `attemptLoginUsingOneTimePassword()`).
- Passwordless registration.
- Notification `CustomerLoginCode`.
- Result messages in Indonesian and English.
- Throttle `commerce-login-code`.
- Refusing staff in shared-guard mode.
- View `storefront/account/code`.
- Health check for the missing trait.

**Done when:** tests show a code signing in on the commerce guard only, a wrong / expired /
different-origin / rate-limited code each giving its message, a new request cancelling the old
code, unknown emails answered like known ones, and staff refused when the guard is shared.

### C7.4 Google sign-in
**Depends on:** C7.2

**Files:**
- Add `laravel/socialite`.
- `src/Customers/Auth/GoogleController.php` (redirect, callback) and `SocialAccount` linking rules
  (`ARCHITECTURE.md` §16.2).
- Accounts settings toggles, disabled without `services.google.*`.
- Health check.

**Done when:** tests with Socialite's fake show an existing link signing in, a verified email
linking, a new user created only when registration is open, and staff refused in shared-guard mode.

### C7.5 My Account
**Depends on:** C7.2

**Files:**
- `src/Customers/AccountNavigation.php` (`Commerce::registerAccountPage()`).
- Views `storefront/account/{overview,addresses,profile}` and partial `account-nav`.
- Actions `SaveAddress`, `DeleteAddress`, `UpdateProfile` (email change re-verifies),
  `SetPassword`, `RequestAccountDeletion` (staff email in C11.3).

**Done when:** tests cover address CRUD with region validation and defaults, profile changes,
email re-verification, a registered extension page in the navigation, and that another customer's
address can't be edited.

### C7.6 Customers admin and Users scope
**Depends on:** C7.1, C3.1, U3

**Files:**
- `Sunrice::usersQueryUsing()` registration (hides customer-role-only users).
- `src/Http/Controllers/Admin/CustomersController.php` and pages `Commerce/Customers/Index` and
  `Show`.
- Actions `UpdateCustomer`, `SendPasswordResetLink`, `MarkEmailVerified`, `AnonymizeCustomer`.
- The customer roles setting used by the role editor on the customer page.

**Done when:** tests show Users listing staff only, filters, permissions, and anonymization
removing personal data (orders checked once C8.1 exists, add that assertion there).

---

## Phase 8 — Orders, shipping, checkout

### C8.1 Orders schema and state machine
**Depends on:** C2.5, C7.1

**Files:**
- Migrations `create_commerce_orders_table`, `create_commerce_order_items_table`,
  `create_commerce_order_adjustments_table`, `create_commerce_order_events_table`,
  `create_commerce_payments_table`, `create_commerce_refunds_table`,
  `create_commerce_shipments_table`, `create_commerce_documents_table`.
  Columns as in `ARCHITECTURE.md` §6.4.
- Models in `src/Orders/Models/`.
- `src/Orders/OrderStateMachine.php` (the SPEC transition table and quote statuses).
- `src/Orders/Timeline.php`.
- `src/Orders/Numbering.php` (order, quote and invoice formats from settings, using C2.5).
- Events `OrderStatusChanged`, `OrderCancelled`, `OrderCompleted`, `OrderOnHold`.
- The settings lock for currency once an order exists (completes C2.2).

**Done when:** a table-driven test exercises every allowed and refused transition, timeline rows
record the actor and source, numbers follow the formats, and the currency lock is enforced.

### C8.2 Shipping
**Depends on:** C5.1, C2.6, C3.3

**Files:**
- Migrations `create_commerce_shipping_zones_table`, `create_commerce_shipping_zone_regions_table`,
  `create_commerce_shipping_methods_table`.
- Contract `ShippingMethodType` (plus `TracksShipments`, `BooksShipments`).
- `ShippingRequest`, `Package`, `ShippingRate`.
- Built-ins `FreeShipping`, `FlatRate`, `WeightBased`, `LocalPickup`.
- `ZoneMatcher` and `ShippingManager`; the Calculator's `Shipping` stage becomes real.
- Settings section Shipping: page `Commerce/Settings/Shipping` with the zones list and editor
  (region picker, methods with their settings schema), courier presets.
- `Commerce::registerShippingMethodType()` and `registerCourier()`.

**Done when:** tests cover zone matching (province, city, district, country, everywhere else,
order), each method's cost including weight rounding and volumetric weight, availability filters,
local pickup skipping the address, and a fake carrier type registered by a test.

### C8.3 Checkout page
**Depends on:** C6.2, C7.1, C8.2

**Files:**
- `src/Checkout/CheckoutData.php` and `CheckoutValidator.php`.
- Routes `commerce.checkout` (show, update section, refresh rates).
- Component `<x-commerce::checkout>`; views `storefront/checkout` and partials `address-form`,
  `region-select`, `shipping-methods`, `payment-methods`, `summary`.
- The payment section uses `PaymentManager` (null until C9.1, so Online store mode can't complete
  yet: the action refuses with "no payment method", covered by a test).
- Saved addresses, dropshipper, notes, terms, extension fields (`Commerce::checkoutFieldsUsing()`).
- `CheckoutStarted` event.
- `commerce.js`: region cascade and shipping refresh.

**Done when:** tests cover each settings toggle, Indonesian address validation, rates refreshing
on address change (form post and JSON), guest vs account rules, and the hidden steps when
`shipping` is inactive or nothing needs shipping.

### C8.4 Placing orders
**Depends on:** C8.1, C8.3, C5.3, C5.4, C4.8

**Files:**
- `src/Checkout/Actions/PlaceOrder.php` (`ARCHITECTURE.md` §11.3).
- `CheckoutChanged` exception and its rendering.
- Contract `CheckoutCompletion` and `OrderCompletion`, `QuoteCompletion`, `WhatsAppCompletion`;
  `WhatsAppMessage`.
- Event `OrderPlaced` (and `QuoteRequested`).
- Routes and views `storefront/order` (thank-you) and `track-order`.
- `LinkGuestOrders` implementation.
- Pause orders.
- `Commerce::registerCheckoutCompletion()`.

**Done when:** tests cover:
- a double submit giving one order;
- a price change between rendering and placing aborting with the change listed;
- stock, sale and voucher reservations all-or-nothing (a failure in the last one leaves nothing
  reserved);
- each selling mode's initial states;
- the WhatsApp URL content;
- the order page only by key, and the lookup needing number plus email;
- pause orders refusing.

### C8.5 Order lifecycle automation
**Depends on:** C8.4

**Files:**
- Listeners `ReleaseReservations`, `AutoCompleteOrder`, `UpdateCustomerStats`, `RecordSalesCount`.
- Tick steps: expire unpaid orders past `expires_at` (paused while awaiting confirmation), expire
  quotes.
- Customer cancellation (setting) from the order page and account.

**Done when:** tests cover expiry releasing everything once (idempotent on retries), the
awaiting-confirmation pause, customer cancel allowed only while unpaid, and auto-complete for
digital-only orders.

### C8.6 Admin orders
**Depends on:** C8.4, C3.1

**Files:**
- `src/Http/Controllers/Admin/OrdersController.php`.
- Pages `Commerce/Orders/Index` (DataTable, filters, saved columns, bulk actions, export) and
  `Show` (items, totals breakdown, customer and addresses, payments, timeline with notes,
  documents placeholder, actions per permission, extension panels via
  `SunriceCommerce.registerOrderPanel`).
- Actions `AddOrderNote`, `UpdateOrderAddresses`, `TransitionOrder`, `TrashOrder`.
- CSV export (`spatie/simple-excel`).
- `Commerce::registerOrderPanel()`.

**Done when:** tests cover each permission, the filters, the export columns, a customer-visible
note being emailed (hook to C11.3; assert the event now), and trash refusing orders with payments
for force delete.

### C8.7 Shipments and fulfilment
**Depends on:** C8.6

**Files:**
- Actions `CreateShipment`, `UpdateShipment`, `MarkDelivered`.
- Order page Shipments panel; the customer order page shows tracking.
- Events `ShipmentCreated` and `ShipmentDelivered`; auto-complete when fully shipped (setting).

**Done when:** tests cover partial shipments, the over-fulfilment refusal, tracking URLs from
presets, and the fulfilment status transitions.

### C8.8 Manual orders and editing unpaid orders
**Depends on:** C8.6

**Files:**
- Actions `CreateManualOrder` and `EditOrder` (frozen prices, overrides with permission,
  re-reservation of the stock difference); page `Commerce/Orders/Create`; editor mode on `Show`.
- `OrderEdited` event; "send payment link" (email in C11.3).

**Done when:** tests cover creation with each payment status, overrides refused without permission,
the stock difference reserved and released correctly, and editing refused once paid.

### C8.9 Refunds
**Depends on:** C8.6

**Files:** `RecordRefund` (`ARCHITECTURE.md` §12.3; through `RecordPaymentResult` after C9.1 —
until then it updates the totals directly, behind the same method), the refund dialog, restock, and
the `OrderRefunded` event.

**Done when:** tests cover a partial refund, a full refund changing the status, restock movements,
and the refusal of amounts over what was paid.

### C8.10 Quotes
**Depends on:** C8.6, C8.4

**Files:**
- Actions `RespondToQuote`, `AcceptQuote`, `DeclineQuote`.
- Quote list filter and editor on the order pages.
- Storefront `storefront/quote` (view, accept, decline).
- Events `QuoteSent`, `QuoteAccepted`, `QuoteDeclined`, `QuoteExpired`.

**Done when:** tests show a quote never reserving stock until accepted, accepting with prices frozen
as quoted, an expired quote refusing acceptance, and the order number assigned only on acceptance.

### C8.11 Account orders
**Depends on:** C8.4, C7.5

**Files:** views `storefront/account/{orders,order}`, buy again (adds available lines to the
cart, reporting the ones that aren't), cancel (setting), and quotes in Quotation mode.

**Done when:** tests show customers seeing only their own orders, linked guest orders appearing
after verification, buy again respecting availability, and the cancel rules.

---

## Phase 9 — Payments

### C9.1 Payments framework
**Depends on:** C8.4, C3.3

**Files:**
- Contracts (`ARCHITECTURE.md` §13.1); `PaymentStart`, `PaymentResult`, `WebhookEvent`, `Fee`,
  `PaymentContext`.
- `PaymentManager` (registry, method instances, availability, fees in the `Fees` stage).
- `RecordPaymentResult` (`ARCHITECTURE.md` §13.2).
- Pay page `order/{key}/pay` and return route.
- Migration `create_commerce_webhook_calls_table`, route `commerce/webhooks/{method}` (stateless)
  with idempotency.
- Tick step for payment expiry.
- Settings → Payments page (`Commerce/Settings/Payments`: order, enable, per-method schema).
- `Commerce::registerPaymentMethod()`.
- `workbench/app/Commerce/FakeGateway.php` (redirect, webhook, refund, status check).

**Done when:** tests with the fake gateway cover a redirect payment completing by webhook,
duplicate webhooks ignored, an out-of-order "pending" after "paid" ignored, an invalid signature
refused, expiry, the pay page switching methods, and fees in totals.

### C9.2 Manual payment methods
**Depends on:** C9.1

**Files:**
- `src/Payments/Methods/BankTransfer.php` (accounts, instructions, unique code with the
  uniqueness search in `PlaceOrder`), `PaymentInstructions.php` (instances, e.g. QRIS),
  `CashOnDelivery.php`.
- Their settings schemas.
- Partials `storefront/payments/{bank-transfer,instructions,cod}` for the order page and emails.
- Bank presets (logos) in config.

**Done when:** tests cover unique-code amounts (distinct across open orders), instruction
snapshots surviving later settings changes, COD starting as Processing unpaid, and availability
rules.

### C9.3 Payment confirmations
**Depends on:** C9.2, C8.6; uses U13 when merged.

**Files:**
- Migration `create_commerce_payment_confirmations_table`; model.
- `SubmitPaymentConfirmation` (validation, private storage, image re-encode, deadline pause),
  `ApproveConfirmation`, `RejectConfirmation`, `MarkOrderPaid`.
- Routes and views `storefront/confirm-payment` and the order page form.
- Admin page `Commerce/Confirmations/Index` (queue, proof viewer, approve/reject) and the order
  page panel.
- Throttle `commerce-confirm`, honeypot, captcha.
- Events `PaymentConfirmationSubmitted`, `PaymentConfirmationApproved`,
  `PaymentConfirmationRejected`.
- Proof pruning step.

**Done when:** tests cover submit → awaiting → approve → paid → processing (and digital grants
fired), reject → unpaid with the deadline restored, the lower-amount approval needing an explicit
flag, proofs not publicly reachable, re-encoded images, and the permission checks.

---

## Phase 10 — Digital delivery

### C10.1 Grants and downloads
**Depends on:** C4.12, C9.1, C8.6

**Files:**
- Migrations `create_commerce_download_grants_table` and `create_commerce_download_logs_table`.
- `GrantDownloads` (listener on `OrderPaid`, or `OrderCompleted` by setting) and
  `DownloadController` (`downloads/{token}`).
- Account page `storefront/account/downloads`.
- Admin order panel: resend, extend, reset count, revoke.
- Event `DownloadsGranted`.
- Grants honoured while `digital` is inactive.

**Done when:** tests cover granting once, the count limit, expiry, revocation, the S3-style
temporary URL redirect (fake disk), external URL grants, logging, and guests downloading by token
without an account.

### C10.2 Delivery by email
**Depends on:** C10.1, C11.2

**Files:** `DeliverDownloads` and the `downloads_ready` email, with attachments when they are under
the size limit and links otherwise, per the product's delivery modes.

**Done when:** tests cover attachments under the limit, links over it, account-only delivery not
emailing files, and the timeline record.

---

## Phase 11 — Documents and notifications

### C11.1 Invoices, packing slips, quotations
**Depends on:** C8.6

**Files:**
- Add `barryvdh/laravel-dompdf`.
- Contract `DocumentRenderer` and `DompdfRenderer`; `Documents` service.
- Views `documents/{invoice,packing-slip,quotation}` (table layouts), publish tag
  `commerce-documents`.
- Invoice numbering on placement or payment.
- Caching by `order_version`.
- Admin routes (single and bulk packing slips) and the customer invoice route.
- Settings section Documents completed.

**Done when:** tests cover each document rendering (a PDF byte signature and HTML content checks),
numbering assigned once, regeneration after an edit, the bulk PDF, and permissions or order key for
access.

### C11.2 Notification framework
**Depends on:** C8.1, C3.3

**Files:**
- `Notifier`, `CommerceNotification` (queued, order locale, settings-driven texts, branded markdown
  layout), the email registry (`Commerce::registerEmail()`), recipients (addresses plus roles).
- Settings → Emails page (`Commerce/Settings/Emails`: list, editor, preview, send test).
- Timeline records.
- Account emails from C7 moved onto the framework.

**Done when:** tests cover an email switched off not sending, staff recipients by role, the
subject in the order's language, preview rendering, and test sending.

### C11.3 Order and staff emails
**Depends on:** C11.2, C11.1, C9.3, C8.7, C8.10

**Files:** every email key in `ARCHITECTURE.md` §19 not yet implemented, with their triggers
(listeners), the attachment settings, and the low-stock and out-of-stock staff emails (on the
inventory events).

**Done when:** a test per email asserts the trigger, the recipients and the attachments (fake
mail), and `Mail::fake()` assertions cover a full order lifecycle sending the expected sequence.

---

## Phase 12 — Storefront templates and polish

### C12.1 Publishable templates and theme
**Depends on:** C4.9, C6.2, C6.3, C6.4, C7.5, C8.4, C8.10, C8.11, C9.3, C10.1; uses U15 when
merged.

**Files:**
- `stubs/templates/**` (the tree in `ARCHITECTURE.md` §22.3), each file starting with a comment
  listing its variables and components.
- Publish tag `commerce-templates` (templates and theme); publish tag `commerce-translations`.
- `stubs/theme/commerce.css` (matching Sunrice's starter theme) and the complete `commerce.js`
  (cart, variant picker, region cascade, countdown, shipping refresh, wishlist/compare buttons).
- Header integration partial (mini cart, account link, wishlist count) to include from the site
  header.
- Menu links (U15).
- Translations `lang/{id,en}` completed.

**Done when:** after publishing into the workbench, every page renders from the app copies,
the fallbacks still work without publishing, and a test asserts every published file is valid
Blade (compiles).

### C12.2 Product page, flash sale, accessibility, no-JS
**Depends on:** C12.1

**Files:**
- Gallery variant switching.
- Countdown and progress.
- Accessible variant picker (radio groups, disabled combinations announced).
- Focus management in the mini cart drawer.
- A no-JavaScript pass over every flow.

**Done when:** feature tests drive add-to-cart → checkout → order with plain form posts only; HTML
assertions check labels, roles and `aria-*` on the picker and drawer.

### C12.3 Caching and performance
**Depends on:** C12.1; uses U11 when merged.

**Files:**
- The U11 hook excluding product, product-taxonomy and store pages and commerce sessions.
- Catalog version bumps reviewed.
- Query budget tests for every page in `ARCHITECTURE.md` §26.

**Done when:** budgets pass with 1,000 products and 50 orders, and with the full-page cache on (a
workbench with `spatie/laravel-responsecache`) store pages are never cached.

### C12.4 SEO
**Depends on:** C12.1

**Files:** noindex on private pages; JSON-LD validated against schema.org shapes in tests;
filtered listings with `rel=canonical` to the unfiltered listing; brand index SEO; sitemap check
that product and term pages are included (Sunrice) and store pages aren't.

**Done when:** the tests above pass.

---

## Phase 13 — Analytics

### C13.1 Tracking and aggregation
**Depends on:** C8.4, C4.6; uses U9 when merged.

**Files:**
- Migrations `create_commerce_stats_daily_table` and `create_commerce_product_stats_daily_table`.
- `StatsRecorder` (queued; recomputes a day), the real `Tracking` implementation (views after the
  response, CTA counts), bot and staff filters, inquiry counts (U9 or a `FormSubmission` observer).
- `commerce:stats {--rebuild} {--from=}` and a nightly re-run of yesterday.

**Done when:** tests show recomputation being idempotent, refunds counted on their date, cancelled
orders excluded, views skipping bots and staff, and the timezone boundary handled.

### C13.2 Dashboard KPIs and charts
**Depends on:** C13.1, C3.5

**Files:** dashboard deferred props (KPIs with comparison, the sales series, top products, recent
orders, to-do counts); `Chart` and `KpiCard` components (recharts) exposed on
`window.SunriceCommerce.components`; extension widgets (`Commerce::registerDashboardWidget()`).

**Done when:** tests check the KPI values against fixture orders, and typecheck and build pass.

### C13.3 Reports and exports
**Depends on:** C13.1

**Files:** `src/Analytics/Reports/{Sales,Products,Categories,Brands,Vouchers,Customers,Stock,Ctas}Report.php`;
page `Commerce/Reports/Show`; CSV export; permissions.

**Done when:** each report matches fixture expectations, and the export is streamed with the right
columns.

### C13.4 Store card on Sunrice's dashboard
**Depends on:** C13.2, U2

**Files:** the U2 card registration and component (today's sales, to-do counts).

**Done when:** the card shows for Shop Managers and is hidden for Editors.

---

## Phase 14 — MCP tools

### C14.1 Store tools: info, orders, payments
**Depends on:** C8.6, C9.3; uses U6 when merged.

**Files:**
- `src/Mcp/Tools/{GetStoreInfo,ListOrders,GetOrder,UpdateOrder,CreateOrder,RefundOrder,ListPaymentConfirmations,ReviewPaymentConfirmation}Tool.php`,
  each with `shouldRegister()` (feature and permission).
- Instructions (U6).
- `tests/Feature/Mcp/*` using laravel/mcp's testing helpers and Sunrice's token auth.

**Done when:**
- every tool calls the same actions as the admin;
- the activity log shows source `ai`;
- a user without the permission doesn't see the tool, and an inactive module hides its tools;
- review and refund need an explicit confirm argument from the agent.

### C14.2 Store tools: catalog, customers, promotions, reports, settings
**Depends on:** C14.1 and each tool's module (C4.8, C7.6, C5.2–C5.4, C13.3, C3.4, C8.2)

**Files:**
`{ListProducts,GetProduct,AdjustStock,ListCustomers,GetCustomer,ListVouchers,SaveVoucher,ListFlashSales,SaveFlashSale,SavePricingRule,SalesReport,GetStoreSettings,UpdateStoreSettings,SetStoreFeature,QuoteShipping}Tool.php`.
`get_product` documents the `product` field's shape for `update_entry`.

**Done when:** each tool has a happy-path test and a permission or feature refusal test.

---

## Phase 15 — Extension SDK

### C15.1 Registration API and contracts, final
**Depends on:** C8.6, C9.1, C11.2

**Files:**
- Every `Commerce::register*` method from `ARCHITECTURE.md` §24.1 implemented and documented.
- `window.SunriceCommerce` API final.
- `docs/extending.md` (contracts, events, slots, admin JS, features, settings sections, emails,
  account pages, health checks).

**Done when:** every public method has a test through a fake extension provider in `tests/`, and
the docs list every event and slot.

### C15.2 Reference fakes and contract tests
**Depends on:** C15.1, C8.2, C9.1

**Files:**
- `workbench/app/Commerce/{FakeGateway,FakeCourier,FakeLoyalty}`:
  - FakeLoyalty is a discount provider with commit/release, an account page, a checkout slot, a
    dashboard widget and listeners on order events.
- `tests/Feature/Extensions/*` running a full order through each fake.
- `docs/extension-package.md`: a step-by-step guide to building `sunrice/commerce-<name>`.

**Done when:** the three fakes pass end to end, including refunds and cancellations reversing
loyalty points.

---

## Phase 16 — Install, docs and release

### C16.1 Install and upgrade commands
**Depends on:** all backend phases

**Files:** `src/Console/InstallCommand.php` (`commerce:install {--templates} {--demo} {--no-regions} {--force}`):
1. publish the config and assets;
2. publish the `spatie/laravel-one-time-passwords` migration if its table is missing;
3. migrate;
4. add `HasOneTimePasswords` to the user model (`EnsureUserModelTraits`);
5. scaffold (C4.4);
6. sync permissions and seed roles;
7. import regions (asks; default level from the store country);
8. publish templates (`--templates`);
9. demo store (`--demo`: products with variants, a bundle, a digital product, vouchers, a flash
   sale, Indonesian zones);
10. print next steps (scheduler, queue, mail, Google keys).

It is safe to rerun. `docs/upgrading.md` lists the upgrade steps (`commerce:publish-assets`,
`migrate`, `sunrice:sync-permissions`, `commerce:seed-roles`).

**Done when:** a Testbench test runs the command non-interactively on a fresh app (twice), then
signs in as admin and sees the Shop group; `--demo` produces a store whose checkout works.

### C16.2 Documentation
**Depends on:** C16.1; uses U8 when merged.

**Files (`docs/`):**

| Group | Files |
| --- | --- |
| Setup | `installation.md`, `configuration.md` (every config key and settings section), `upgrading.md`, `commands.md` |
| Modules | `features.md` (modules, dependencies, what "off" does), `catalog.md` (products, variants, bundles, digital, inventory), `pricing.md` (order of application, rules, flash sales, vouchers, taxes) |
| Selling | `checkout.md` (modes, fields, addresses, completion), `orders.md` (states, numbering, admin), `payments.md`, `shipping.md`, `regions.md` |
| Customers and output | `accounts.md`, `emails.md`, `documents.md` |
| Storefront | `templates.md`, `blade-components.md`, `helpers.md` |
| Insights and AI | `analytics.md`, `ai-agents.md` |
| Extending | `extending.md`, `extension-package.md` |

Also: `README.md` quick start; registration in Manage → Docs (U8).

**Done when:** every public API (`Commerce::`, helpers, components, contracts, events, config keys,
commands) is documented; a test lists the documented names and compares them with the code (as
Sunrice's docs review).

### C16.3 End-to-end verification
**Depends on:** C16.1

**Files:**
- `database/seeders/DemoStoreSeeder.php`.
- `tests/Feature/EndToEndTest.php` (`ARCHITECTURE.md` §28).
- `tests/Feature/FeatureMatrixTest.php`, final.
- `workbench` storefront using the published templates.

**Done when:** both tests pass on all three databases in CI.

### C16.4 Release
**Depends on:** C16.2, C16.3

**Files:** `CHANGELOG.md` `## 1.0.0`, rebuilt `dist/`, tag `v1.0.0` (after maintainer approval).
Composer requires a `sunrice/cms` release that contains U1, U3 and U4.

**Done when:** `composer require sunrice/commerce` into a fresh Laravel 13 app with Sunrice,
followed by `php artisan commerce:install --demo`, gives a working store (catalog, cart, checkout
with bank transfer and confirmation, order admin) without running npm.

---

## 5. Definition of done (every task)

- The code follows §1 conventions, `SPEC.md` and `ARCHITECTURE.md`.
- New behaviour has Pest tests, and `composer test`, `composer lint` and `composer analyse` pass.
  Admin frontend tasks also pass `npm run typecheck`, `npm run test:frontend` and `npm run build`,
  with `dist/` committed.
- Authorization is enforced on the server for every admin endpoint and MCP tool. Every public
  write is rate-limited and CSRF-protected (webhooks excepted, which are signature-checked).
- The module's surfaces are gated by its feature and covered in `FeatureMatrixTest`.
- Staff changes are recorded in the activity log, and order changes on the order timeline.
- No dependencies outside §2. Only Sunrice public API plus merged U-tasks.
- Developer-facing changes are in `docs/` and `CHANGELOG.md` (`## Unreleased`).
- The PR description lists the task id, what was built, any U-task fallback used, and any deviation
  from this plan, `ARCHITECTURE.md` or `SPEC.md`.
