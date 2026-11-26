<?php

declare(strict_types=1);

it('sanitizes rich text at render time with commerce_rich_text', function () {
    expect(commerce_rich_text('<p>Hello <strong>world</strong></p>'))->toContain('<p>Hello <strong>world</strong></p>')
        ->and(commerce_rich_text('<script>alert(1)</script><p>Hi</p>'))->not->toContain('<script')
        ->and(commerce_rich_text('<img src="x" onerror="alert(1)">'))->not->toContain('onerror')
        ->and(commerce_rich_text('<a href="javascript:alert(1)">x</a>'))->not->toContain('javascript:')
        ->and(commerce_rich_text('<a href="https://example.com">ok</a>'))->toContain('https://example.com')
        ->and(commerce_rich_text(null))->toBe('')
        ->and(commerce_rich_text(''))->toBe('');
});
