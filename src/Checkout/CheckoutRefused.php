<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use RuntimeException;

/** The order can't be placed now (orders paused, a reservation failed); the message says why. */
class CheckoutRefused extends RuntimeException {}
