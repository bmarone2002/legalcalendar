type RateLimitConfig = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateBucket = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, RateBucket>();

function nowMs(): number {
  return Date.now();
}

export function getRateLimitKey(req: Request, prefix: string): string {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}

export function checkRateLimit(config: RateLimitConfig): RateLimitDecision {
  const now = nowMs();
  const existing = memoryStore.get(config.key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(config.key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: Math.max(config.limit - 1, 0),
      retryAfterSeconds: Math.ceil(config.windowMs / 1000),
    };
  }

  if (existing.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
    };
  }

  existing.count += 1;
  memoryStore.set(config.key, existing);
  return {
    allowed: true,
    remaining: Math.max(config.limit - existing.count, 0),
    retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
  };
}
