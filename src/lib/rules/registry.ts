import type { RuleDefinition } from "./types";

const registry = new Map<string, RuleDefinition>();

export function register(rule: RuleDefinition): void {
  registry.set(rule.id, rule);
}

export function get(id: string): RuleDefinition | undefined {
  return registry.get(id);
}
