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
- `commerce:publish-assets` refreshes the admin bundle and the fallback storefront theme under
  `public/vendor/commerce/`.
- `sunrice:sync-permissions` and `commerce:seed-roles` add new permissions and give them to the
  Shop Manager role.

`php artisan commerce:install` does all of this too, and is safe to run again.

## Published templates

If you published the storefront templates (`--templates` or `--starter`), they don't change with an upgrade.
Compare yours with the package's after reading the changelog: each template starts with a comment
listing the variables it gets, and the changelog names templates that changed. The storefront
prefers the published copies under `resources/views/commerce/` and `public/commerce-theme/`.
Merge changes into these copies if you have customized them. To replace the published templates
and theme with the package versions:

```bash
php artisan vendor:publish --tag=commerce-templates --force   # overwrites; commit your copies first
```

If you also published translations, merge any new keys into your language files. See
[Storefront templates and translations](templates.md#translations).

## Statistics

When a release changes how sales are counted, the changelog says so; recompute history with:

```bash
php artisan commerce:stats --rebuild
```

## Customer accounts on `sunrice/account`

From this release, customer accounts are the Accounts plugin's and there is no guest checkout.
Composer installs `sunrice/account` with commerce. After updating:

1. In your panel provider, add the account plugin and its Users screen:

   ```php
   use Sunrice\Account\AccountPlugin;
   use Sunrice\Account\Admin\AccountUserResource;

   $panel->userResource(AccountUserResource::class)
       ->plugin(CmsPlugin::make())->plugin(AccountPlugin::make())->plugin(CommercePlugin::make());
   ```

   Remove `Sunrice\Commerce\Admin\StaffUserResource`: it no longer exists.
2. Run `php artisan migrate` and `php artisan account:install`.
3. Remove the `HasOneTimePasswords` trait (and its import) from your user model; you can also
   remove `spatie/laravel-one-time-passwords` and `laravel/socialite` if your app required them
   only for commerce.
4. Set up sign-in in **Settings → Accounts** (registration, email verification, the emailed code,
   Google, default roles, the account emails). The old Settings → Store → Accounts values are
   not carried over.
5. If you published the storefront templates, follow the template notes in `CHANGELOG.md`:
   the account sign-in templates are gone, account pages fill `@section('commerce-account')`, and
   the checkout partials lost their guest variables.

There is no data migration. See [accounts.md](accounts.md) and [checkout.md](checkout.md#accounts-at-checkout).

## Breaking changes

Commerce follows semantic versioning for the public API listed in [extending.md](extending.md), the
helpers, the Blade components, the config keys and the template variables. Before 1.0, a minor
version (0.2, 0.3…) may break them; from 1.0, breaking changes wait for the next major. Either
way, `CHANGELOG.md` lists them with the steps to take.
