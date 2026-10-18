<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Storefront\WhatsApp;
use Sunrice\Commerce\Support\Address;
use Sunrice\Commerce\Support\MoneyFormatter;

/** The WhatsApp message for an order, from the per-language template, to the next number in rotation. */
class WhatsAppMessage
{
    public function __construct(protected WhatsApp $whatsapp, protected MoneyFormatter $money) {}

    public function text(Order $order): string
    {
        $order->loadMissing('items');
        $items = $order->items->whereNull('parent_id')->map(fn (OrderItem $i) => '- '.$i->quantity.' × '.$i->title().' — '.$this->money->format($i->subtotal))->implode("\n");
        $address = $order->shipping_address !== null ? Address::fromArray($order->shipping_address)->format($order->locale, ', ') : '';

        return $this->whatsapp->message('order_message', [
            'order_number' => $order->displayNumber(),
            'items' => $items,
            'total' => $this->money->format($order->total),
            'name' => $order->customer_name,
            'phone' => $order->phone,
            'address' => $address,
            'shipping' => $order->shipping_method['label'] ?? '',
            'notes' => $order->customer_note,
            'url' => $order->url(),
        ], $order->locale);
    }

    public function url(Order $order): ?string
    {
        $number = $this->whatsapp->next();

        return $number === null ? null : $this->whatsapp->url($number, $this->text($order));
    }
}
