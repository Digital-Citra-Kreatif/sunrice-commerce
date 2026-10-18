<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use RuntimeException;

/** An action refused for a business reason; the message is shown to the user. */
class DomainException extends RuntimeException {}
