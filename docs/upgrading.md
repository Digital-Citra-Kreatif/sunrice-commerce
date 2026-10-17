# Upgrading

## Every upgrade

```bash
composer update sunrice/commerce
php artisan migrate
php artisan commerce:publish-assets
php artisan sunrice:sync-permissions
php artisan commerce:seed-roles
php artisan view:clear
```

- `migrate` adds new tables and columns. Migrations never drop your data.
- `commerce:publish-assets` copies the new admin bundle. Without it the admin keeps the old one.
- `sunrice:sync-permissions` and `commerce:seed-roles` add new permissions and give them to the
  Shop Manager role.

`php artisan commerce:install` does all of this too, and is safe to run again.

## Published templates

If you published the storefront templates (`--templates`), they don't change with an upgrade.
Compare yours with the package's after reading the changelog: each template starts with a comment
listing the variables it gets, and the changelog names templates that changed. Publish a fresh copy
of one template to compare:

```bash
php artisan vendor:publish --tag=commerce-templates --force   # overwrites; commit your copies first
```

## Statistics

When a release changes how sales are counted, the changelog says so; recompute history with:

```bash
php artisan commerce:stats --rebuild
```

## Breaking changes

1.x follows semantic versioning for the public API listed in [extending.md](extending.md), the
helpers, the Blade components, the config keys and the template variables. Breaking changes wait
for 2.0 and are listed in `CHANGELOG.md` with the steps to take.
