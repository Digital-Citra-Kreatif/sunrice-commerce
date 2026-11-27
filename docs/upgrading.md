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
Composer installs `sunrice/account` 0.2.1 or newer in the 0.2 series with Commerce.
Prepare the app before updating:

1. Remove `HasOneTimePasswords` and its import from your user model if you added it for
   Commerce. Composer can remove the package during the update, and its package-discovery
   script loads the user model. If the panel provider uses
   `Sunrice\Commerce\Admin\StaffUserResource`, remove that registration before the update
   and add the new Users resource in step 3.
2. Set your app's Composer constraints for the Commerce release and for Account 0.2 if you list
   Account directly. Then run `composer update sunrice/commerce --with-all-dependencies`.
   If your app uses Content Restriction, set its constraint to a release that supports Account 0.2
   and include `sunrice/content-restriction` in the same command. Content Restriction 0.1.0
   requires Account 0.1.
3. In your panel provider, add the account plugin and its Users screen:

   ```php
   use Sunrice\Account\AccountPlugin;
   use Sunrice\Account\Admin\AccountUserResource;

   $panel->userResource(AccountUserResource::class)
       ->plugin(CmsPlugin::make())->plugin(AccountPlugin::make())->plugin(CommercePlugin::make());
   ```

4. Clear cached routes with `php artisan route:clear`. Run `php artisan account:install` and the
   Artisan commands under [Every upgrade](#every-upgrade).
   You can remove the app's direct requirements on `spatie/laravel-one-time-passwords` and
   `laravel/socialite` if it added them only for Commerce.
5. Set up sign-in in **Settings → Accounts** (registration, email verification, the emailed code,
   Google, default roles, the account emails). The old Settings → Store → Accounts values are
   not carried over.
6. If you published the storefront templates, follow the template notes in `CHANGELOG.md`:
   the account sign-in templates are gone, account pages fill `@section('commerce-account')`, and
   the checkout partials lost their guest variables.

There is no data migration. See [accounts.md](accounts.md) and [checkout.md](checkout.md#accounts-at-checkout).

## Breaking changes

Commerce follows semantic versioning for the public API listed in [extending.md](extending.md), the
helpers, the Blade components, the config keys and the template variables. Before 1.0, a minor
version (0.2, 0.3…) may break them; from 1.0, breaking changes wait for the next major. Either
way, `CHANGELOG.md` lists them with the steps to take.
