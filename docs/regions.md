# Indonesian regions

Commerce ships with Indonesia's official list of provinces, cities/regencies, districts and
villages. Addresses use it for cascading selects, shipping zones and vouchers use it to say where,
and carrier packages map it to their own location ids. Other countries use an ISO country list
with free-text state and city.

## Contents

- [The bundled dataset](#the-bundled-dataset)
- [Importing](#importing)
- [Codes and levels](#codes-and-levels)
- [Re-importing and updates](#re-importing-and-updates)
- [How addresses store regions](#how-addresses-store-regions)
- [Postal codes](#postal-codes)
- [The regions JSON endpoint](#the-regions-json-endpoint)
- [Regions in admin forms](#regions-in-admin-forms)
- [Shipping zones and voucher destinations](#shipping-zones-and-voucher-destinations)
- [Carrier mappings](#carrier-mappings)
- [Other countries](#other-countries)

## The bundled dataset

The files live in `database/data/regions`:

| File | Level | Rows |
| --- | --- | --- |
| `provinces.csv` | Provinces | 38 |
| `cities.csv` | Cities and regencies | 514 |
| `districts.csv` | Districts (kecamatan) | 7,285 |
| `villages.csv.gz` | Villages (kelurahan/desa), with postal codes | 83,762 |

- Source: Kepmendagri No. 300.2.2-2430 Tahun 2025, through the MIT-licensed `cahyadsn/wilayah`
  (names and codes) and `cahyadsn/wilayah_kodepos` (postal codes) datasets. The licences and
  attribution are in `database/data/regions/NOTICE.md`.
- Columns: `code,parent_code,name,kind,postal_code`.
- `kind` is `provinsi`, `kabupaten`, `kota`, `kecamatan`, `kelurahan`, `desa` or `desa_adat`.

## Importing

```bash
php artisan commerce:regions:import                  # down to districts (the default)
php artisan commerce:regions:import --level=village  # everything, with postal codes
```

`--level` is `province`, `city`, `district` or `village`; each level includes the ones above it.
`php artisan commerce:install` asks to import and uses `--regions=district` by default
(`--no-regions` skips it). See [installation.md](installation.md).

Import villages if you switch on **Ask for the village** (`checkout.village_level`), or the
village select stays empty and Indonesian addresses can't be completed. Villages also carry the
postal codes.

The rows go into `commerce_regions` (`code`, `parent_code`, `level`, `name`, `kind`,
`postal_code`, `active`, `dataset`), as `Regions\Region` models. The import runs in one
transaction, in batches of 1,000.

## Codes and levels

Codes are the official Kemendagri codes, each one extending its parent's:

| Level | `Region::LEVELS` | Example | Name |
| --- | --- | --- | --- |
| Province | `1` | `32` | Jawa Barat |
| City/regency | `2` | `32.73` | Kota Bandung |
| District | `3` | `32.73.01` | Sukasari |
| Village | `4` | `32.73.01.1001` | Sukarasa |

```php
use Sunrice\Commerce\Regions\Region;

Region::levelOf('32.73.01');          // 3
Region::lineage('32.73.01.1001');     // ['32', '32.73', '32.73.01', '32.73.01.1001']
Region::query()->active()->where('parent_code', '32.73')->orderBy('name')->get();
Region::find('32.73')->children;      // its districts
```

## Re-importing and updates

New region data arrives with package releases. Run the import again after updating:

- names, kinds and postal codes are updated;
- new codes are added;
- codes that are no longer in the data are marked **inactive**, never deleted.

Inactive regions disappear from the selects and can't be chosen for new addresses, but saved
addresses, orders and zones that use them keep working and keep their names. The import also
clears the regions endpoint's cache.

## How addresses store regions

An Indonesian address (`Support\Address`, country `ID`) keeps both the codes and the names:

```php
[
    'country' => 'ID',
    'province_code' => '32', 'province' => 'Jawa Barat',
    'city_code' => '32.73', 'city' => 'Kota Bandung',
    'district_code' => '32.73.01', 'district' => 'Sukasari',
    'village_code' => '32.73.01.1001', 'village' => 'Sukarasa',
    'postal_code' => '40152',
    // name, phone, company, state, line1, line2, notes
]
```

- `Support\AddressRules::normalize()` fills the names from the region table, so a posted form only
  needs the codes. The names are never taken from the request.
- `AddressRules::after()` checks that the codes exist, are active and form one chain (the district
  is in the city, the city in the province).
- Orders keep the address as a snapshot (`shipping_address`, `billing_address`), and the address
  book (`commerce_addresses`) stores the same fields. A renamed region doesn't change how
  an old order prints.
- `Address::regionCodes()` gives the codes from the most specific to the province; `lines()` and
  `format()` print the address.

## Postal codes

Postal codes come with villages (level 4). Districts and above have none.

- In the address form, choosing a village fills the postal code field when it is empty.
- When an address is saved with a village and no postal code, `normalize()` fills it from the
  village.
- Customers can always type a postal code; Settings → Store → Checkout → **Require a postal code**
  makes it required.

## The regions JSON endpoint

The address selects load from:

```text
GET /commerce/api/regions                → the provinces
GET /commerce/api/regions?parent=32      → the cities of a province
GET /commerce/api/regions?parent=32.73   → the districts of a city
GET /commerce/api/regions?parent=32.73.01 → the villages of a district
```

- Route name `commerce.api.regions` (also under `/{locale}`); the prefix is
  `commerce.storefront.paths.api`. Use `commerce_url('commerce.api.regions')` for the URL.
- Only active regions, sorted by name. A `parent` that isn't a province, city or district code
  returns the provinces.
- The answer is cached for a day (and sent with a one-day public cache header):

```json
{"data": [
    {"code": "32.73.01", "name": "Sukasari", "kind": "kecamatan"},
    {"code": "32.73.02", "name": "Coblong", "kind": "kecamatan"}
]}
```

Villages include `postal_code`.

The storefront form is the partial `partials.address-fields`. Its small script fills each select
from the one above it, hides the Indonesian selects for other countries and shows free-text city
and state instead. See [templates.md](templates.md).

## Regions in admin forms

The `commerce_region` field type (`Admin\Fields\RegionField`) is a country select followed by the
Indonesian selects. Its value is `{country, province_code, city_code, district_code,
village_code}`.

```php
['handle' => 'region', 'type' => 'commerce_region', 'label' => 'Region', 'config' => ['depth' => 'city']]
```

| Config | Default | |
| --- | --- | --- |
| `depth` | `district` | The deepest select: `province`, `city`, `district` or `village`. |
| `countries` | `true` | Whether other countries can be chosen. |

It validates the chain like checkout does. Commerce uses it for the store address (to district),
shipping zones (to district), voucher destinations (to city) and order addresses (to village).
Extension settings sections can use it too; see [extending.md](extending.md#settings-sections).

## Shipping zones and voucher destinations

- **Shipping zones** list regions: a country, or a province, city or district in Indonesia. A
  region covers everything under its code, so `32` matches any address in West Java and `32.73`
  any address in Bandung. Zones are checked in order and the first match wins. See
  [shipping.md](shipping.md#zones-and-how-they-match).
- **Voucher destinations** ("Only for shipping to") list a country, province or city. The voucher
  applies when the shipping address is in that country and, when a code is set, has that province
  or city code. See [pricing.md](pricing.md).
- **Payment methods** can be limited to province codes ("Only for provinces"). See
  [payments.md](payments.md#payment-settings).

## Carrier mappings

Carrier packages store their own location ids for region codes in `commerce_region_mappings`
(`provider`, `region_code`, `external_id`, `meta`; one row per provider and code):

```php
use Sunrice\Commerce\Regions\RegionMapping;

RegionMapping::for('biteship', '32.73.01.1001'); // the most specific mapped id: village, then district, city, province
```

## Other countries

`Regions\Countries` is a built-in ISO 3166-1 list with English and Indonesian names
(`Countries::exists('SG')`, `Countries::name('SG', 'id')`, `Countries::options()`). Addresses
outside Indonesia have a free-text city (required) and state, and no region codes. Shipping zones
can still match them by country.
