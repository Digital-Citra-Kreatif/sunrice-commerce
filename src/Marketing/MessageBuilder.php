<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Illuminate\Mail\Markdown;
use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\Models\CampaignLink;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Notifications\Templates;

/**
 * Renders a marketing email for one recipient: the smart tags replaced,
 * the store's email frame and colors, links rewritten to count clicks,
 * an image to count opens, and the unsubscribe link.
 */
class MessageBuilder
{
    /** @var array<int, array<string, true>> campaign id => link hashes known to exist */
    protected array $known = [];

    public function __construct(protected SmartTags $tags) {}

    /**
     * @param  array<string, mixed>  $context  cart_id, order_id…
     * @return array{subject: string, html: string, text: string, unsubscribe_url: string}
     */
    public function build(Campaign $campaign, ?Customer $customer, string $email, string $locale, string $token, array $context = [], bool $track = true): array
    {
        $content = $campaign->contentFor($locale);
        $unsubscribe = $token === '' ? url('/') : route('commerce.marketing.unsubscribe', ['token' => $token]);
        $cart = isset($context['cart_id']) ? Cart::query()->find((int) $context['cart_id']) : null;
        $values = $this->tags->values($customer, $email, $locale, [
            'cart' => $cart,
            'cart_url' => $cart !== null && $token !== '' && Route::has('commerce.cart.restore')
                ? commerce_url('commerce.cart.restore', ['token' => $token], $locale)
                : (Route::has('commerce.cart') ? commerce_url('commerce.cart', [], $locale) : url('/')),
            'voucher_code' => (string) (($campaign->trigger_config ?? [])['voucher_code'] ?? ''),
            'unsubscribe_url' => $unsubscribe,
        ]);

        $body = $this->absolute($this->tags->render($content['body'], $values, html: true));
        $button = $content['button_label'] !== '' && $content['button_url'] !== ''
            ? ['label' => $this->tags->render($content['button_label'], $values), 'url' => $this->tags->render($content['button_url'], $values)]
            : null;
        $templates = app(Templates::class);
        $data = [
            'store' => ['name' => commerce_store_name(), 'url' => url('/'), 'logo' => StoreEmail::logoUrl()],
            'brand' => StoreEmail::brandColor(),
            'preheader' => $this->tags->render($content['preheader'], $values),
            // An HTML block on one line, so the Markdown frame leaves it alone.
            'body' => trim((string) preg_replace('/\s*\R\s*/', ' ', $body)),
            'button' => $button,
            'unsubscribe_url' => $unsubscribe,
            'lang' => $locale,
        ];
        $html = (string) app(Markdown::class)->theme($templates->themeView())->render('commerce::emails.marketing', $data);
        if ($track && $token !== '') {
            $html = $this->trackLinks($campaign, $html, $token, $unsubscribe);
            $html = str_replace('</body>', '<img src="'.e(route('commerce.marketing.open', ['token' => $token])).'" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px;"></body>', $html);
        }

        return [
            'subject' => trim(strip_tags($this->tags->render($content['subject'], $values))),
            'html' => $html,
            'text' => $this->text($body, $button, $unsubscribe),
            'unsubscribe_url' => $unsubscribe,
        ];
    }

    /** Every http(s) link goes through the click counter, except the unsubscribe link. */
    protected function trackLinks(Campaign $campaign, string $html, string $token, string $unsubscribe): string
    {
        return preg_replace_callback('/(<a\s[^>]*href=")([^"]+)(")/i', function (array $m) use ($campaign, $token, $unsubscribe): string {
            $url = html_entity_decode($m[2]);
            if (! preg_match('#^https?://#i', $url) || $url === $unsubscribe) {
                return $m[0];
            }
            $hash = CampaignLink::hashFor($url);
            if (! isset($this->known[$campaign->id][$hash])) {
                CampaignLink::query()->firstOrCreate(['campaign_id' => $campaign->id, 'hash' => $hash], ['url' => $url]);
                $this->known[$campaign->id][$hash] = true;
            }

            return $m[1].e(route('commerce.marketing.click', ['token' => $token, 'link' => $hash])).$m[3];
        }, $html) ?? $html;
    }

    /** Site-relative links and images (/storage/…) made absolute: an email has no site to be relative to. */
    protected function absolute(string $html): string
    {
        return preg_replace_callback('/\b(href|src)="(\/(?!\/)[^"]*)"/i', fn (array $m) => $m[1].'="'.e(url(html_entity_decode($m[2]))).'"', $html) ?? $html;
    }

    /** @param  array{label: string, url: string}|null  $button */
    protected function text(string $body, ?array $button, string $unsubscribe): string
    {
        $text = preg_replace('/<a\s[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/is', '$2 ($1)', $body) ?? $body;
        $text = preg_replace(['/<\/(p|h[1-6]|li|div)>/i', '/<br\s*\/?>/i', '/<li[^>]*>/i'], ["\n\n", "\n", '- '], $text) ?? $text;
        $text = trim((string) preg_replace("/\n{3,}/", "\n\n", html_entity_decode(strip_tags($text))));
        if ($button !== null) {
            $text .= "\n\n{$button['label']}: {$button['url']}";
        }

        return $text."\n\n".__('commerce::marketing.unsubscribe_text', ['url' => $unsubscribe]);
    }
}
