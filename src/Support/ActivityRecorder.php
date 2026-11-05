<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Sunrice\Admin\Activity\ActivityLog;

/**
 * Commerce lines in the panel's activity log (Administration → Activity
 * log), with types such as order, voucher, stock, store_setting. A string
 * subject is the line's label; a model is the subject, labelled by its
 * label() (or number, name, title) when it has one.
 */
class ActivityRecorder
{
    /** @param  array<string, mixed>  $properties  `changes` (list of what changed) and/or `note` */
    public function record(string $action, Model|string $subject, array $properties = [], ?string $type = null): void
    {
        $type ??= $subject instanceof Model ? Str::snake(class_basename($subject)) : 'store';
        $label = is_string($subject) ? $subject : self::label($subject);
        app(ActivityLog::class)->record($action, $type, $subject instanceof Model ? $subject : null, $label, $properties);
    }

    protected static function label(Model $model): ?string
    {
        if (method_exists($model, 'label')) {
            return (string) $model->label();
        }
        foreach (['number', 'name', 'title', 'code', 'sku'] as $attribute) {
            $value = $model->getAttribute($attribute);
            if (is_scalar($value) && (string) $value !== '') {
                return (string) $value;
            }
        }

        return null;
    }
}
