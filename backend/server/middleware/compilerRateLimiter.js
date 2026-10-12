/**
 * In-memory sliding-window rate limiter for execution endpoints
 */
const requestLog = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function compilerRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  if (!requestLog.has(ip)) {
    requestLog.set(ip, []);
  }

  const timestamps = requestLog.get(ip).filter(ts => now - ts < WINDOW_MS);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded: Maximum 30 code executions per minute allowed. Please wait before retrying.'
    });
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  next();
}

module.exports = compilerRateLimiter;
