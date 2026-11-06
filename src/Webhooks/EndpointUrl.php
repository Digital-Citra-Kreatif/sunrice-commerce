<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks;

/**
 * Where a webhook may be sent: a public HTTPS URL. Private, loopback,
 * link-local and reserved addresses are refused (when saving, and again
 * before each delivery, after resolving the host), so an endpoint can't
 * be pointed at the server's own network. `commerce.webhooks.allow_private`
 * lifts that for development.
 */
final class EndpointUrl
{
    /** Why the URL can't be used, or null when it can. */
    public static function problem(string $url, bool $resolve = true): ?string
    {
        $parts = parse_url($url);
        if (! is_array($parts) || ! isset($parts['scheme'], $parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
            return 'Enter a full URL, like https://example.com/webhooks.';
        }
        $private = (bool) config('commerce.webhooks.allow_private', false);
        $scheme = strtolower($parts['scheme']);
        if ($scheme !== 'https' && ! ($private && $scheme === 'http')) {
            return 'Use an https:// URL.';
        }
        if ($private) {
            return null;
        }
        $host = trim(strtolower($parts['host']), '[]');
        if ($host === 'localhost' || str_ends_with($host, '.localhost') || str_ends_with($host, '.local') || str_ends_with($host, '.internal')) {
            return 'Use a public address, not a local one.';
        }
        $ips = filter_var($host, FILTER_VALIDATE_IP) !== false ? [$host] : ($resolve ? self::resolve($host) : []);
        if ($resolve && $ips === []) {
            return 'The host name doesn\'t resolve.';
        }
        foreach ($ips as $ip) {
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                return 'Use a public address, not a private or reserved one.';
            }
        }

        return null;
    }

    /** @return list<string> the host's IPv4 and IPv6 addresses */
    protected static function resolve(string $host): array
    {
        $records = @dns_get_record($host, DNS_A | DNS_AAAA) ?: [];
        $ips = [];
        foreach ($records as $record) {
            $ip = $record['ip'] ?? $record['ipv6'] ?? null;
            if (is_string($ip)) {
                $ips[] = $ip;
            }
        }

        return $ips;
    }
}
