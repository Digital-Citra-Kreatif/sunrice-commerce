# Indonesian administrative regions

Provinces, cities/regencies, districts (kecamatan) and villages
(kelurahan/desa) with postal codes, used by `php artisan commerce:regions:import`.

- **Decree:** Kepmendagri No. 300.2.2-2430 Tahun 2025 (amending 300.2.2-2138 Tahun 2025).
- **Counts:** 38 provinces, 514 cities/regencies, 7,285 districts, 83,762 villages.
- **Codes:** the official Kemendagri codes (`32`, `32.73`, `32.73.01`, `32.73.01.1001`).
- **Sources:**
  - names and codes: https://github.com/cahyadsn/wilayah (`db/wilayah.sql`);
  - postal codes: https://github.com/cahyadsn/wilayah_kodepos (`db/wilayah_kodepos.sql`).
- **Converted:** 2026-10-17 with `bin/build-regions.php`.

Columns: `code,parent_code,name,kind,postal_code`. `kind` is `provinsi`,
`kabupaten`, `kota`, `kecamatan`, `kelurahan`, `desa` or `desa_adat`.

## Licences

Both datasets are MIT-licensed:

### cahyadsn/wilayah

```
MIT License

Copyright (c) 2017-2025 Cahya DSN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### cahyadsn/wilayah_kodepos

```
MIT License

Copyright (c) 2024 Cahya DSN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
