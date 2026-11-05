<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp;

use Illuminate\Auth\Access\AuthorizationException;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Sunrice\Admin\Ai\Tool;
use Sunrice\Admin\Panel;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Inventory\OutOfStock;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\InvalidTransition;
use Throwable;

/**
 * Base for the store's MCP tools (ARCHITECTURE.md §23): listed only while
 * "Store tools for AI agents" and the tool's module are on and the
 * token's user has the permission; they call the admin's actions with an
 * `ai` actor, and answer domain refusals (a transition that isn't allowed,
 * nothing left to refund…) as tool errors the agent can read.
 */
abstract class CommerceTool extends Tool
{
    /** The module the tool needs, besides ai_tools. */
    protected ?string $feature = null;

    /** The permission the tool needs. */
    protected ?string $permission = null;

    abstract protected function run(Request $request): Response;

    public function shouldRegister(): bool
    {
        $user = auth(app(Panel::class)->getGuard())->user();
        $features = app(Features::class);

        return parent::shouldRegister() && $user !== null && $features->active('ai_tools')
            && ($this->feature === null || $features->active($this->feature))
            && ($this->permission === null || $user->can($this->permission));
    }

    /** @throws AuthorizationException */
    public function handle(Request $request): Response
    {
        if (! $this->shouldRegister()) {
            throw new AuthorizationException('This store tool is switched off or you don\'t have permission for it.');
        }
        try {
            return $this->run($request);
        } catch (Throwable $e) {
            if ($this->refusal($e)) {
                return Response::error($e->getMessage());
            }
            throw $e;
        }
    }

    /**
     * Refuses unless the token's user has this permission (each change an
     * agent asks for needs its own, as in the admin).
     *
     * @throws AuthorizationException
     */
    protected function authorize(string $permission): void
    {
        if (! $this->can($permission)) {
            throw new AuthorizationException("You don't have permission for this ({$permission}).");
        }
    }

    /** The agent asked for something that isn't there ("Order not found."). */
    protected function notFound(string $what): Response
    {
        return Response::error("{$what} not found.");
    }

    /** Exceptions whose message is meant for the person (or agent) asking. */
    protected function refusal(Throwable $e): bool
    {
        return $e instanceof \DomainException || $e instanceof \InvalidArgumentException || $e instanceof AuthorizationException
            || $e instanceof InvalidTransition || $e instanceof OutOfStock;
    }

    protected function actor(): Actor
    {
        // The token's name goes with every change in the activity log (the panel records it).
        return Actor::ai(auth(app(Panel::class)->getGuard())->user(), null);
    }

    /** Refuses unless the agent passed confirm: true (after asking the user). */
    protected function unconfirmed(Request $request, string $what): ?Response
    {
        return $request->boolean('confirm')
            ? null
            : Response::error("This will {$what}. Ask the user first, then call again with confirm: true.");
    }
}
