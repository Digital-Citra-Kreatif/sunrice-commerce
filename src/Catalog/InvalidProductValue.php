<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use RuntimeException;

/** A published product value that doesn't validate (recorded as the sync error, not reported). */
class InvalidProductValue extends RuntimeException {}
