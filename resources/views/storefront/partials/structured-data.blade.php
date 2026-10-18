{{--
    schema.org Product JSON-LD for the product page head. $product: ProductView.
--}}
<script type="application/ld+json">{!! json_encode($product->structuredData(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) !!}</script>
