<?php

namespace App\Services\Ai;

use App\Services\Ai\Tools\AiTool;
use InvalidArgumentException;

/**
 * In-memory registry of AiTool instances.
 *
 * Register tools from a service provider (see `App\Providers\AiServiceProvider`)
 * at app boot; the AiAssistantService reads `schemas()` to populate the LLM's
 * tool-calling payload and calls `execute()` when the model returns a tool_call.
 *
 * The registry is intentionally a singleton: tools themselves are stateless
 * dispatchers, so one instance shared across the request is safe. Modules can
 * register their own tools by resolving this service and calling `register()`
 * from their own ServiceProvider::boot().
 *
 *     $this->app->resolving(AiToolRegistry::class, function (AiToolRegistry $registry) {
 *         $registry->register(new MyCustomTool);
 *     });
 */
class AiToolRegistry
{
    /**
     * @var array<string, AiTool>
     */
    protected array $tools = [];

    public function register(AiTool $tool): void
    {
        $this->tools[$tool->name()] = $tool;
    }

    /**
     * @return array<string, AiTool>
     */
    public function all(): array
    {
        return $this->tools;
    }

    public function get(string $name): ?AiTool
    {
        return $this->tools[$name] ?? null;
    }

    /**
     * Export all registered tools as the `tools` array for an OpenAI-style chat request.
     *
     * @return array<int, array<string, mixed>>
     */
    public function schemas(): array
    {
        return array_values(array_map(
            fn (AiTool $tool): array => $tool->toOpenAiToolSchema(),
            $this->tools,
        ));
    }

    /**
     * Execute a tool by name, injecting company + user scope from the caller's session.
     *
     * The AiAssistantService is the only place this should be called from — that's
     * how we guarantee the `$companyId` and `$userId` arguments are session-authoritative
     * and never influenced by LLM output.
     *
     * @param  array<string, mixed>  $arguments
     *
     * @throws InvalidArgumentException When the tool name is not registered.
     */
    public function execute(string $name, array $arguments, int $companyId, int $userId): mixed
    {
        $tool = $this->get($name);

        if ($tool === null) {
            throw new InvalidArgumentException("Unknown AI tool: {$name}");
        }

        return $tool->execute($arguments, $companyId, $userId);
    }

    /**
     * Test-only: reset the registry between tests that exercise different tool sets.
     */
    public function flush(): void
    {
        $this->tools = [];
    }
}
