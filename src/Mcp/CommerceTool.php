<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp;

use Illuminate\Auth\Access\AuthorizationException;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Inventory\OutOfStock;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Mcp\Tools\SunriceTool;
use Throwable;

/**
 * Base for the store's MCP tools (ARCHITECTURE.md §23): listed only while
 * "Store tools for AI agents" and the tool's module are on and the
 * token's user has the permission; they call the admin's actions with an
 * `ai` actor, and answer domain refusals (a transition that isn't allowed,
 * nothing left to refund…) as tool errors the agent can read.
 */
abstract class CommerceTool extends SunriceTool
{
    /** The module the tool needs, besides ai_tools. */
    protected ?string $feature = null;

    /** The permission the tool needs. */
    protected ?string $permission = null;

    abstract protected function run(Request $request): Response;

    public function shouldRegister(): bool
    {
        $user = auth()->user();
        $features = app(Features::class);

        return $user !== null && $features->active('ai_tools')
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

    /** Exceptions whose message is meant for the person (or agent) asking. */
    protected function refusal(Throwable $e): bool
    {
        return $e instanceof \DomainException || $e instanceof \InvalidArgumentException
            || $e instanceof InvalidTransition || $e instanceof OutOfStock;
    }

    protected function actor(): Actor
    {
        $token = request()->attributes->get('sunrice.api_token_name');

        return Actor::ai(auth()->user(), is_string($token) ? $token : null);
    }

    /** Refuses unless the agent passed confirm: true (after asking the user). */
    protected function unconfirmed(Request $request, string $what): ?Response
    {
        return $request->boolean('confirm')
            ? null
            : Response::error("This will {$what}. Ask the user first, then call again with confirm: true.");
    }
}
