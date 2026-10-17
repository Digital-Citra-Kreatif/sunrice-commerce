<?php

declare(strict_types=1);

/*
 * Payment gateway webhooks: stateless (no session, no CSRF), verified by
 * each gateway's signature. Added by the payments phase.
 */
