import { redis } from '../redis.js';

/**
 * Middleware to enforce idempotency on state-changing requests using x-idempotency-key header.
 * @param {number} ttlSeconds - Duration in seconds to lock the key (default: 86400 / 24h)
 */
export const idempotency = (ttlSeconds = 86400) => async (req, res, next) => {
    // Only enforce on POST, PUT, PATCH
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
        return next();
    }

    const idempotencyKey = req.headers['x-idempotency-key'];
    if (!idempotencyKey) {
        return next(); // Optional header, proceed if not provided
    }

    const tenantId = req.headers['x-tenant-id'] || (req.user && req.user.tenantId) || 'global';
    const redisKey = `idempotency:${tenantId}:${idempotencyKey}`;

    try {
        const cachedResponse = await redis.get(redisKey);

        if (cachedResponse) {
            const parsed = JSON.parse(cachedResponse);
            return res.status(parsed.status).json({
                ...parsed.body,
                _idempotent: true,
                _cached_at: parsed.cachedAt,
            });
        }

        // Intercept res.json to cache response before sending
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redis.set(
                    redisKey,
                    JSON.stringify({
                        status: res.statusCode,
                        body,
                        cachedAt: new Date().toISOString(),
                    }),
                    'EX',
                    ttlSeconds
                ).catch((err) => console.error('Failed to cache idempotent response:', err));
            }
            return originalJson(body);
        };

        next();
    } catch (err) {
        console.error('Idempotency Middleware Error:', err);
        next(); // Fallback to executing request on Redis error
    }
};
