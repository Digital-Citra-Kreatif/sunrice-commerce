<?php

declare(strict_types=1);

use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Admin\SchemaForm;

it('builds a per-language group the admin draws as language tabs, validated per language', function () {
    $field = SchemaForm::perLanguage('title', 'Title', 'text', 10, ['instructions' => 'Shown at checkout.'], requireMain: true);

    expect($field)->toMatchArray(['handle' => 'title', 'type' => 'group', 'label' => 'Title', 'instructions' => 'Shown at checkout.'])
        ->and($field['config'])->toMatchArray(['per_language' => true, 'main' => 'id'])
        ->and(array_column($field['config']['fields'], 'handle'))->toBe(['id', 'en'])
        ->and(array_column($field['config']['fields'], 'required'))->toBe([true, false]);

    $form = SchemaForm::make([$field]);
    expect($form->validate(['title' => ['id' => 'Transfer', 'en' => null]]))->toBe(['title' => ['id' => 'Transfer', 'en' => null]]);
    expect(fn () => $form->validate(['title' => ['id' => '', 'en' => 'Bank transfer']]))->toThrow(ValidationException::class);
    expect(fn () => $form->validate(['title' => ['id' => 'Far too long a title', 'en' => null]]))->toThrow(ValidationException::class);
});
