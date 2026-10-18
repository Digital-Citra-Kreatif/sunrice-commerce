<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health;

use Throwable;

class HealthRegistry
{
    /** @var array<string, class-string<HealthCheck>> */
    protected array $checks = [];

    /** @param  class-string<HealthCheck>  $class */
    public function register(string $class): void
    {
        $this->checks[$class] = $class;
    }

    /** @return array<string, array{label: string, result: HealthResult}> key => outcome */
    public function run(): array
    {
        $results = [];
        foreach ($this->checks as $class) {
            $check = app($class);
            try {
                $result = $check->run();
            } catch (Throwable $e) {
                report($e);
                $result = HealthResult::error('The check failed: '.$e->getMessage());
            }
            $results[$check->key()] = ['label' => $check->label(), 'result' => $result];
        }

        return $results;
    }
}
