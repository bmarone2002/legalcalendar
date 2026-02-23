import type { RuleDefinition } from "./types";

const registry = new Map<string, RuleDefinition>();

export function register(rule: RuleDefinition): void {
  registry.set(rule.id, rule);
}

export function get(id: string): RuleDefinition | undefined {
  return registry.get(id);
}

export function getAll(): RuleDefinition[] {
  return Array.from(registry.values());
}

export function getByIds(ids: string[]): RuleDefinition[] {
  return ids.map((id) => registry.get(id)).filter(Boolean) as RuleDefinition[];
}
