<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use RuntimeException;

/** A webhook call that failed verification (answered 400, never processed). */
class InvalidWebhook extends RuntimeException {}
