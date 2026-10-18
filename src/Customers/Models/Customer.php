<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A store customer: linked to a user account (user_id), or a guest who
 * ordered with an email. Email is unique and lowercase.
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $email
 * @property string|null $name
 * @property string|null $phone
 * @property bool $accepts_marketing
 * @property Carbon|null $marketing_consent_at
 * @property string|null $locale
 * @property int $orders_count
 * @property int $total_spent
 * @property Carbon|null $first_order_at
 * @property Carbon|null $last_order_at
 * @property string|null $note
 * @property Carbon|null $deletion_requested_at
 * @property Carbon|null $anonymized_at
 * @property array<string, mixed>|null $meta
 * @property Carbon|null $created_at
 */
class Customer extends Model
{
    protected $table = 'commerce_customers';

    protected $guarded = [];

    protected $casts = [
        'accepts_marketing' => 'boolean',
        'marketing_consent_at' => 'datetime',
        'first_order_at' => 'datetime',
        'last_order_at' => 'datetime',
        'deletion_requested_at' => 'datetime',
        'anonymized_at' => 'datetime',
        'meta' => 'array',
        'total_spent' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (Customer $customer): void {
            $customer->email = mb_strtolower(trim($customer->email));
        });
    }

    /** The customer record of a user (created on first need). */
    public static function forUser(Authenticatable $user): self
    {
        $id = (int) $user->getAuthIdentifier();
        $email = mb_strtolower((string) $user->getAttribute('email'));

        return static::query()->where('user_id', $id)->first()
            ?? tap(static::query()->firstOrNew(['email' => $email]), function (Customer $c) use ($id, $user): void {
                $c->user_id ??= $id;
                $c->name ??= (string) $user->getAttribute('name');
                $c->save();
            });
    }

    /** @return HasMany<Address, $this> */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function user(): ?Authenticatable
    {
        $model = config('sunrice.auth.user_model');

        return $this->user_id === null ? null : $model::query()->find($this->user_id);
    }
}
