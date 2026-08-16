/**
 * In-Memory Sliding Window Rate Limiter for Gemini API
 * Protects against quota exhaustion and excessive bursts
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Default limit: 15 requests per minute (matches Gemini Free Tier 15 RPM)
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  clientIdentifier: string = 'global-client',
  maxRequests: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = WINDOW_SIZE_MS
): RateLimitResult {
  const now = Date.now();
  const record = ipRequestMap.get(clientIdentifier) || { timestamps: [] };

  // Filter timestamps within the sliding window
  const validTimestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldestTimestamp));

    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetMs
    };
  }

  // Record new request timestamp
  validTimestamps.push(now);
  ipRequestMap.set(clientIdentifier, { timestamps: validTimestamps });

  // Cleanup old entries occasionally using forEach
  if (ipRequestMap.size > 1000) {
    ipRequestMap.forEach((val, key) => {
      if (val.timestamps.every(t => now - t > windowMs)) {
        ipRequestMap.delete(key);
      }
    });
  }

  return {
    success: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - validTimestamps.length),
    resetMs: windowMs
  };
}
