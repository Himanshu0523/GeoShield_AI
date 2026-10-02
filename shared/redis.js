import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy(times) {
        if (times > 3) return null; // stop reconnecting if redis is not running
        return Math.min(times * 500, 2000);
    }
});

redis.on('connect', () => console.log('⚡ Connected to Redis'));
redis.on('error', (err) => {
    // Suppress spam when developing without Redis container
});
