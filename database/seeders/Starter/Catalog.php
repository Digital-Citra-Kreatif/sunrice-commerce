<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Seeders\Starter;

/**
 * What the starter store sells: colours, sizes, categories, brands, tags
 * and about fifty apparel products. Text is given in Indonesian and
 * English; the seeder uses the site's main language. Prices are rupiah.
 */
final class Catalog
{
    /** @return array<string, array{id: string, en: string, hex: string}> colour slug => names and swatch */
    public static function colors(): array
    {
        return [
            'off-white' => ['id' => 'Putih Gading', 'en' => 'Off White', 'hex' => '#efeae0'],
            'white' => ['id' => 'Putih', 'en' => 'White', 'hex' => '#f7f7f5'],
            'black' => ['id' => 'Hitam', 'en' => 'Black', 'hex' => '#1f1f1f'],
            'navy' => ['id' => 'Biru Dongker', 'en' => 'Navy', 'hex' => '#26324a'],
            'grey' => ['id' => 'Abu-abu', 'en' => 'Grey', 'hex' => '#9a9a98'],
            'beige' => ['id' => 'Krem', 'en' => 'Beige', 'hex' => '#cdb79a'],
            'olive' => ['id' => 'Hijau Zaitun', 'en' => 'Olive', 'hex' => '#6b6b47'],
            'brown' => ['id' => 'Cokelat', 'en' => 'Brown', 'hex' => '#7a5640'],
            'red' => ['id' => 'Merah', 'en' => 'Red', 'hex' => '#b23a3a'],
            'blue' => ['id' => 'Biru', 'en' => 'Blue', 'hex' => '#5b7fa6'],
            'pink' => ['id' => 'Merah Muda', 'en' => 'Pink', 'hex' => '#d9a9a6'],
            'green' => ['id' => 'Hijau', 'en' => 'Green', 'hex' => '#4f6b55'],
        ];
    }

    /** @return array<string, array<int, string>> size set => sizes, smallest first */
    public static function sizes(): array
    {
        return [
            'adult' => ['XS', 'S', 'M', 'L', 'XL'],
            'men' => ['S', 'M', 'L', 'XL', 'XXL'],
            'kids' => ['110', '120', '130', '140', '150'],
            'one' => [],
        ];
    }

    /**
     * Two levels: department => its categories.
     *
     * @return array<string, array{id: string, en: string, shape: string, color: string, children: array<string, array{id: string, en: string, shape: string, color: string}>}>
     */
    public static function categories(): array
    {
        $c = fn (string $id, string $en, string $shape, string $color) => ['id' => $id, 'en' => $en, 'shape' => $shape, 'color' => $color];

        return [
            'women' => [...$c('Wanita', 'Women', 'knit', '#cdb79a'), 'children' => [
                'women-t-shirts' => $c('Kaus', 'T-shirts', 'tee', '#efeae0'),
                'women-knitwear' => $c('Rajut', 'Knitwear', 'knit', '#d9a9a6'),
                'women-outerwear' => $c('Jaket & Mantel', 'Outerwear', 'jacket', '#cdb79a'),
                'women-trousers' => $c('Celana', 'Trousers', 'trousers', '#1f1f1f'),
                'women-skirts' => $c('Rok', 'Skirts', 'skirt', '#4f6b55'),
                'women-accessories' => $c('Aksesori', 'Accessories', 'tote', '#efeae0'),
            ]],
            'men' => [...$c('Pria', 'Men', 'jacket', '#26324a'), 'children' => [
                'men-t-shirts' => $c('Kaus', 'T-shirts', 'tee', '#26324a'),
                'men-shirts' => $c('Kemeja', 'Shirts', 'shirt', '#5b7fa6'),
                'men-knitwear' => $c('Rajut & Sweter', 'Knitwear', 'knit', '#9a9a98'),
                'men-outerwear' => $c('Jaket', 'Outerwear', 'jacket', '#6b6b47'),
                'men-trousers' => $c('Celana', 'Trousers', 'trousers', '#cdb79a'),
                'men-accessories' => $c('Aksesori', 'Accessories', 'cap', '#1f1f1f'),
            ]],
            'kids' => [...$c('Anak', 'Kids', 'tee', '#b23a3a'), 'children' => [
                'kids-t-shirts' => $c('Kaus Anak', 'Kids T-shirts', 'tee', '#5b7fa6'),
                'kids-outerwear' => $c('Jaket Anak', 'Kids Outerwear', 'jacket', '#b23a3a'),
                'kids-bottoms' => $c('Celana Anak', 'Kids Bottoms', 'shorts', '#26324a'),
                'kids-accessories' => $c('Aksesori Anak', 'Kids Accessories', 'cap', '#d9a9a6'),
            ]],
            'gifts' => [...$c('Hadiah & Digital', 'Gifts & Digital', 'card', '#cdb79a'), 'children' => []],
        ];
    }

    /** @return array<string, array{name: string, id: string, en: string, website: string}> */
    public static function brands(): array
    {
        return [
            'kain' => ['name' => 'KAIN', 'id' => 'Pakaian sehari-hari yang sederhana, nyaman dan tahan lama.', 'en' => 'Simple, comfortable everyday clothing made to last.', 'website' => 'https://example.com/kain'],
            'kain-studio' => ['name' => 'KAIN Studio', 'id' => 'Potongan modern dan bahan premium untuk lemari yang lebih rapi.', 'en' => 'Modern cuts and premium fabrics for a tidier wardrobe.', 'website' => 'https://example.com/studio'],
            'arah-outdoor' => ['name' => 'Arah Outdoor', 'id' => 'Jaket ringan dan tahan cuaca untuk kota dan perjalanan.', 'en' => 'Light, weatherproof jackets for the city and the trail.', 'website' => 'https://example.com/arah'],
            'benang-co' => ['name' => 'Benang & Co', 'id' => 'Aksesori dari bahan alami, dibuat oleh perajin lokal.', 'en' => 'Accessories in natural materials, made by local makers.', 'website' => 'https://example.com/benang'],
            'lumbung-kids' => ['name' => 'Lumbung Kids', 'id' => 'Pakaian anak yang kuat untuk bermain seharian.', 'en' => 'Hard-wearing kids\' clothes for playing all day.', 'website' => 'https://example.com/lumbung'],
        ];
    }

    /** @return array<string, array{id: string, en: string}> */
    public static function tags(): array
    {
        return [
            'essentials' => ['id' => 'Esensial', 'en' => 'Essentials'],
            'new-season' => ['id' => 'Musim Baru', 'en' => 'New season'],
            'best-sellers' => ['id' => 'Terlaris', 'en' => 'Best sellers'],
            'responsible' => ['id' => 'Bahan Bertanggung Jawab', 'en' => 'Responsible materials'],
        ];
    }

    /**
     * The apparel: code (SKU stem), title, shape, category, brand, price,
     * compare-at price, colours, size set and extras. `stock` scales the
     * generated stock (0 sells out every variant), `tiers` adds bulk
     * prices, `days` is how long ago it was published (0: new).
     *
     * @return array<int, array{code: string, title: string, shape: string, category: string, brand: string, price: int, compare?: int, colors: array<int, string>, sizes: string, tags?: array<int, string>, tiers?: bool, featured?: bool, stock?: float, days?: int, material: string}>
     */
    public static function products(): array
    {
        return [
            // Women
            ['code' => 'W01', 'title' => 'Supima Cotton Crew Neck T-Shirt', 'shape' => 'tee', 'category' => 'women-t-shirts', 'brand' => 'kain', 'price' => 149000, 'colors' => ['off-white', 'black', 'navy', 'pink', 'grey'], 'sizes' => 'adult', 'tags' => ['essentials', 'best-sellers'], 'tiers' => true, 'featured' => true, 'days' => 40, 'material' => 'supima'],
            ['code' => 'W02', 'title' => 'Cool Touch Ribbed V-Neck T-Shirt', 'shape' => 'tee', 'category' => 'women-t-shirts', 'brand' => 'kain', 'price' => 129000, 'compare' => 159000, 'colors' => ['white', 'beige', 'blue'], 'sizes' => 'adult', 'tags' => ['essentials'], 'tiers' => true, 'days' => 60, 'material' => 'cool'],
            ['code' => 'W03', 'title' => 'Oversized Heavyweight T-Shirt', 'shape' => 'tee', 'category' => 'women-t-shirts', 'brand' => 'kain-studio', 'price' => 179000, 'colors' => ['off-white', 'black', 'olive'], 'sizes' => 'adult', 'tags' => ['new-season'], 'days' => 0, 'material' => 'cotton'],
            ['code' => 'W04', 'title' => 'Merino Blend Crew Neck Sweater', 'shape' => 'knit', 'category' => 'women-knitwear', 'brand' => 'kain-studio', 'price' => 399000, 'colors' => ['beige', 'navy', 'red', 'grey'], 'sizes' => 'adult', 'tags' => ['best-sellers', 'responsible'], 'featured' => true, 'days' => 25, 'material' => 'merino'],
            ['code' => 'W05', 'title' => 'Soft Cotton Cardigan', 'shape' => 'knit', 'category' => 'women-knitwear', 'brand' => 'kain', 'price' => 349000, 'compare' => 449000, 'colors' => ['off-white', 'pink', 'black'], 'sizes' => 'adult', 'days' => 50, 'material' => 'cotton'],
            ['code' => 'W06', 'title' => 'Cashmere Blend Turtleneck', 'shape' => 'knit', 'category' => 'women-knitwear', 'brand' => 'kain-studio', 'price' => 599000, 'colors' => ['beige', 'black'], 'sizes' => 'adult', 'stock' => 0.1, 'days' => 0, 'tags' => ['new-season'], 'material' => 'cashmere'],
            ['code' => 'W07', 'title' => 'Lightweight Down Jacket', 'shape' => 'jacket', 'category' => 'women-outerwear', 'brand' => 'arah-outdoor', 'price' => 799000, 'colors' => ['black', 'navy', 'beige', 'olive'], 'sizes' => 'adult', 'tags' => ['best-sellers'], 'days' => 70, 'material' => 'down'],
            ['code' => 'W08', 'title' => 'Linen Blend Trench Coat', 'shape' => 'jacket', 'category' => 'women-outerwear', 'brand' => 'kain-studio', 'price' => 999000, 'colors' => ['beige', 'navy'], 'sizes' => 'adult', 'tags' => ['new-season'], 'days' => 3, 'material' => 'linen'],
            ['code' => 'W09', 'title' => 'Wide Leg Pleated Trousers', 'shape' => 'trousers', 'category' => 'women-trousers', 'brand' => 'kain-studio', 'price' => 449000, 'colors' => ['black', 'beige', 'grey'], 'sizes' => 'adult', 'featured' => true, 'days' => 30, 'material' => 'twill'],
            ['code' => 'W10', 'title' => 'Smart Ankle Pants', 'shape' => 'trousers', 'category' => 'women-trousers', 'brand' => 'kain', 'price' => 399000, 'compare' => 499000, 'colors' => ['black', 'navy', 'beige'], 'sizes' => 'adult', 'tags' => ['essentials'], 'days' => 90, 'material' => 'stretch'],
            ['code' => 'W11', 'title' => 'Ultra Stretch Leggings', 'shape' => 'trousers', 'category' => 'women-trousers', 'brand' => 'kain', 'price' => 199000, 'colors' => ['black', 'grey'], 'sizes' => 'adult', 'tags' => ['essentials'], 'tiers' => true, 'days' => 120, 'material' => 'stretch'],
            ['code' => 'W12', 'title' => 'Pleated Midi Skirt', 'shape' => 'skirt', 'category' => 'women-skirts', 'brand' => 'kain-studio', 'price' => 349000, 'colors' => ['navy', 'beige', 'green'], 'sizes' => 'adult', 'days' => 45, 'material' => 'twill'],
            ['code' => 'W13', 'title' => 'Denim A-Line Skirt', 'shape' => 'skirt', 'category' => 'women-skirts', 'brand' => 'kain', 'price' => 299000, 'colors' => ['blue'], 'sizes' => 'adult', 'stock' => 0.4, 'days' => 80, 'material' => 'denim'],
            ['code' => 'W14', 'title' => 'Linen Blend Shirt', 'shape' => 'shirt', 'category' => 'women-t-shirts', 'brand' => 'kain', 'price' => 349000, 'colors' => ['white', 'beige', 'blue'], 'sizes' => 'adult', 'tags' => ['responsible'], 'days' => 20, 'material' => 'linen'],
            ['code' => 'W15', 'title' => 'Puffer Long Coat', 'shape' => 'jacket', 'category' => 'women-outerwear', 'brand' => 'arah-outdoor', 'price' => 1299000, 'colors' => ['black', 'beige'], 'sizes' => 'adult', 'stock' => 0.0, 'days' => 100, 'material' => 'down'],
            ['code' => 'W16', 'title' => 'Canvas Tote Bag', 'shape' => 'tote', 'category' => 'women-accessories', 'brand' => 'benang-co', 'price' => 149000, 'colors' => ['off-white', 'black'], 'sizes' => 'one', 'tags' => ['responsible'], 'days' => 65, 'material' => 'canvas'],
            ['code' => 'W17', 'title' => 'Bucket Hat', 'shape' => 'cap', 'category' => 'women-accessories', 'brand' => 'benang-co', 'price' => 129000, 'colors' => ['beige', 'black', 'olive'], 'sizes' => 'one', 'days' => 2, 'tags' => ['new-season'], 'material' => 'cotton'],
            ['code' => 'W18', 'title' => 'Ribbed Socks 3-Pack', 'shape' => 'socks', 'category' => 'women-accessories', 'brand' => 'kain', 'price' => 99000, 'colors' => ['white', 'black', 'grey'], 'sizes' => 'one', 'tags' => ['essentials'], 'tiers' => true, 'days' => 150, 'material' => 'cotton'],

            // Men
            ['code' => 'M01', 'title' => 'Supima Cotton Relaxed T-Shirt', 'shape' => 'tee', 'category' => 'men-t-shirts', 'brand' => 'kain', 'price' => 149000, 'colors' => ['white', 'black', 'navy', 'grey', 'olive'], 'sizes' => 'men', 'tags' => ['essentials', 'best-sellers'], 'tiers' => true, 'featured' => true, 'days' => 40, 'material' => 'supima'],
            ['code' => 'M02', 'title' => 'Heavyweight Pocket T-Shirt', 'shape' => 'tee', 'category' => 'men-t-shirts', 'brand' => 'kain-studio', 'price' => 199000, 'colors' => ['black', 'off-white', 'brown'], 'sizes' => 'men', 'tags' => ['new-season'], 'days' => 1, 'material' => 'cotton'],
            ['code' => 'M03', 'title' => 'Dry Pique Polo Shirt', 'shape' => 'shirt', 'category' => 'men-shirts', 'brand' => 'kain', 'price' => 249000, 'colors' => ['navy', 'white', 'green'], 'sizes' => 'men', 'tags' => ['essentials'], 'days' => 35, 'material' => 'pique'],
            ['code' => 'M04', 'title' => 'Oxford Slim Fit Shirt', 'shape' => 'shirt', 'category' => 'men-shirts', 'brand' => 'kain', 'price' => 349000, 'colors' => ['white', 'blue'], 'sizes' => 'men', 'tags' => ['best-sellers'], 'days' => 75, 'material' => 'oxford'],
            ['code' => 'M05', 'title' => 'Linen Blend Long Sleeve Shirt', 'shape' => 'shirt', 'category' => 'men-shirts', 'brand' => 'kain-studio', 'price' => 399000, 'compare' => 499000, 'colors' => ['beige', 'white', 'olive'], 'sizes' => 'men', 'tags' => ['responsible'], 'days' => 55, 'material' => 'linen'],
            ['code' => 'M06', 'title' => 'Extra Fine Merino Crew Neck Sweater', 'shape' => 'knit', 'category' => 'men-knitwear', 'brand' => 'kain-studio', 'price' => 449000, 'colors' => ['navy', 'grey', 'black', 'brown'], 'sizes' => 'men', 'tags' => ['best-sellers', 'responsible'], 'featured' => true, 'days' => 28, 'material' => 'merino'],
            ['code' => 'M07', 'title' => 'Waffle Knit Long Sleeve T-Shirt', 'shape' => 'knit', 'category' => 'men-knitwear', 'brand' => 'kain', 'price' => 249000, 'colors' => ['off-white', 'grey', 'olive'], 'sizes' => 'men', 'days' => 85, 'material' => 'cotton'],
            ['code' => 'M08', 'title' => 'Sweat Pullover Hoodie', 'shape' => 'knit', 'category' => 'men-knitwear', 'brand' => 'kain', 'price' => 399000, 'colors' => ['grey', 'black', 'navy'], 'sizes' => 'men', 'days' => 5, 'tags' => ['new-season'], 'material' => 'fleece'],
            ['code' => 'M09', 'title' => 'Utility Field Jacket', 'shape' => 'jacket', 'category' => 'men-outerwear', 'brand' => 'arah-outdoor', 'price' => 899000, 'colors' => ['olive', 'black', 'beige'], 'sizes' => 'men', 'days' => 60, 'material' => 'twill'],
            ['code' => 'M10', 'title' => 'Weatherproof Rain Parka', 'shape' => 'jacket', 'category' => 'men-outerwear', 'brand' => 'arah-outdoor', 'price' => 1099000, 'colors' => ['black', 'navy', 'grey'], 'sizes' => 'men', 'featured' => true, 'days' => 18, 'material' => 'nylon'],
            ['code' => 'M11', 'title' => 'Light Down Vest', 'shape' => 'jacket', 'category' => 'men-outerwear', 'brand' => 'arah-outdoor', 'price' => 599000, 'compare' => 699000, 'colors' => ['black', 'navy'], 'sizes' => 'men', 'stock' => 0.15, 'days' => 95, 'material' => 'down'],
            ['code' => 'M12', 'title' => 'Stretch Slim Fit Chinos', 'shape' => 'trousers', 'category' => 'men-trousers', 'brand' => 'kain', 'price' => 399000, 'colors' => ['beige', 'navy', 'black', 'olive'], 'sizes' => 'men', 'tags' => ['essentials', 'best-sellers'], 'days' => 42, 'material' => 'stretch'],
            ['code' => 'M13', 'title' => 'Relaxed Cargo Pants', 'shape' => 'trousers', 'category' => 'men-trousers', 'brand' => 'arah-outdoor', 'price' => 449000, 'compare' => 549000, 'colors' => ['olive', 'black'], 'sizes' => 'men', 'days' => 33, 'material' => 'twill'],
            ['code' => 'M14', 'title' => 'Selvedge Denim Jeans', 'shape' => 'trousers', 'category' => 'men-trousers', 'brand' => 'kain-studio', 'price' => 599000, 'colors' => ['blue', 'black'], 'sizes' => 'men', 'days' => 110, 'material' => 'denim'],
            ['code' => 'M15', 'title' => 'Easy Shorts', 'shape' => 'shorts', 'category' => 'men-trousers', 'brand' => 'kain', 'price' => 249000, 'colors' => ['navy', 'beige', 'grey'], 'sizes' => 'men', 'days' => 70, 'material' => 'cotton'],
            ['code' => 'M16', 'title' => 'Washed Cotton Cap', 'shape' => 'cap', 'category' => 'men-accessories', 'brand' => 'benang-co', 'price' => 149000, 'colors' => ['black', 'navy', 'beige'], 'sizes' => 'one', 'days' => 65, 'material' => 'cotton'],
            ['code' => 'M17', 'title' => 'Nylon Shoulder Bag', 'shape' => 'tote', 'category' => 'men-accessories', 'brand' => 'arah-outdoor', 'price' => 249000, 'colors' => ['black', 'olive'], 'sizes' => 'one', 'days' => 4, 'tags' => ['new-season'], 'material' => 'nylon'],
            ['code' => 'M18', 'title' => 'Everyday Socks 3-Pack', 'shape' => 'socks', 'category' => 'men-accessories', 'brand' => 'kain', 'price' => 99000, 'colors' => ['black', 'grey', 'navy'], 'sizes' => 'one', 'tags' => ['essentials'], 'tiers' => true, 'days' => 140, 'material' => 'cotton'],

            // Kids
            ['code' => 'K01', 'title' => 'Kids Cotton Crew Neck T-Shirt', 'shape' => 'tee', 'category' => 'kids-t-shirts', 'brand' => 'lumbung-kids', 'price' => 79000, 'colors' => ['white', 'red', 'blue', 'green'], 'sizes' => 'kids', 'tags' => ['essentials'], 'tiers' => true, 'days' => 50, 'material' => 'cotton'],
            ['code' => 'K02', 'title' => 'Kids Striped Long Sleeve T-Shirt', 'shape' => 'knit', 'category' => 'kids-t-shirts', 'brand' => 'lumbung-kids', 'price' => 99000, 'colors' => ['navy', 'pink', 'off-white'], 'sizes' => 'kids', 'days' => 6, 'tags' => ['new-season'], 'material' => 'cotton'],
            ['code' => 'K03', 'title' => 'Kids Light Down Jacket', 'shape' => 'jacket', 'category' => 'kids-outerwear', 'brand' => 'lumbung-kids', 'price' => 499000, 'compare' => 599000, 'colors' => ['red', 'navy', 'pink'], 'sizes' => 'kids', 'days' => 90, 'material' => 'down'],
            ['code' => 'K04', 'title' => 'Kids Fleece Zip Jacket', 'shape' => 'jacket', 'category' => 'kids-outerwear', 'brand' => 'lumbung-kids', 'price' => 299000, 'colors' => ['grey', 'navy'], 'sizes' => 'kids', 'days' => 45, 'material' => 'fleece'],
            ['code' => 'K05', 'title' => 'Kids Knit Cardigan', 'shape' => 'knit', 'category' => 'kids-outerwear', 'brand' => 'lumbung-kids', 'price' => 249000, 'colors' => ['beige', 'pink'], 'sizes' => 'kids', 'stock' => 0.2, 'days' => 38, 'material' => 'cotton'],
            ['code' => 'K06', 'title' => 'Kids Easy Shorts', 'shape' => 'shorts', 'category' => 'kids-bottoms', 'brand' => 'lumbung-kids', 'price' => 149000, 'colors' => ['navy', 'beige'], 'sizes' => 'kids', 'days' => 52, 'material' => 'cotton'],
            ['code' => 'K07', 'title' => 'Kids Stretch Jeans', 'shape' => 'trousers', 'category' => 'kids-bottoms', 'brand' => 'lumbung-kids', 'price' => 249000, 'colors' => ['blue'], 'sizes' => 'kids', 'days' => 77, 'material' => 'denim'],
            ['code' => 'K08', 'title' => 'Kids Sun Cap', 'shape' => 'cap', 'category' => 'kids-accessories', 'brand' => 'lumbung-kids', 'price' => 89000, 'colors' => ['red', 'blue', 'pink'], 'sizes' => 'one', 'days' => 58, 'material' => 'cotton'],
        ];
    }

    /** @return array<string, array{id: string, en: string}> material => description of the fabric */
    public static function materials(): array
    {
        return [
            'supima' => ['id' => '100% katun Supima® berserat panjang', 'en' => '100% long-staple Supima® cotton'],
            'cool' => ['id' => '58% katun, 42% poliester sejuk', 'en' => '58% cotton, 42% cooling polyester'],
            'cotton' => ['id' => '100% katun', 'en' => '100% cotton'],
            'merino' => ['id' => '70% wol merino, 30% nilon', 'en' => '70% merino wool, 30% nylon'],
            'cashmere' => ['id' => '30% kasmir, 70% wol', 'en' => '30% cashmere, 70% wool'],
            'down' => ['id' => 'Nilon ripstop, isian 90% bulu angsa', 'en' => 'Ripstop nylon, 90% down filling'],
            'linen' => ['id' => '55% linen, 45% katun', 'en' => '55% linen, 45% cotton'],
            'twill' => ['id' => '98% katun twill, 2% elastan', 'en' => '98% cotton twill, 2% elastane'],
            'stretch' => ['id' => '72% poliester, 22% rayon, 6% elastan', 'en' => '72% polyester, 22% rayon, 6% elastane'],
            'denim' => ['id' => '99% katun denim, 1% elastan', 'en' => '99% cotton denim, 1% elastane'],
            'canvas' => ['id' => 'Kanvas katun 12 oz', 'en' => '12 oz cotton canvas'],
            'pique' => ['id' => '100% katun pique cepat kering', 'en' => '100% quick-dry cotton piqué'],
            'oxford' => ['id' => '100% katun oxford', 'en' => '100% cotton oxford'],
            'fleece' => ['id' => '100% poliester fleece daur ulang', 'en' => '100% recycled polyester fleece'],
            'nylon' => ['id' => 'Nilon tahan air dengan lapisan DWR', 'en' => 'Water-repellent nylon with a DWR finish'],
        ];
    }
}
