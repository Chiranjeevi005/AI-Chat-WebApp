// Simple in-memory rate limiter for demo purposes
// In production, use Redis or a dedicated rate limiting service

const rateLimitMap = new Map();

export function rateLimit(identifier, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  
  const current = rateLimitMap.get(key) || 0;
  
  if (current >= limit) {
    return {
      success: false,
      limit: limit,
      remaining: 0,
      resetTime: (Math.floor(now / windowMs) + 1) * windowMs
    };
  }
  
  rateLimitMap.set(key, current + 1);
  
  // Clean up old entries periodically
  if (Math.random() < 0.1) {
    const cutoff = now - windowMs;
    for (const [key, value] of rateLimitMap.entries()) {
      const keyTime = parseInt(key.split(':')[1]) * windowMs;
      if (keyTime < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return {
    success: true,
    limit: limit,
    remaining: limit - current - 1,
    resetTime: (Math.floor(now / windowMs) + 1) * windowMs
  };
}