import CircuitBreaker from 'opossum';

const defaultOptions = {
    timeout: 5000, // 5s timeout
    errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
    resetTimeout: 10000, // Wait 10s before attempting half-open state
};

/**
 * Creates a circuit breaker wrapped function for external calls
 * @param {Function} asyncFunction - The function to wrap
 * @param {Object} customOptions - Overriding opossum options
 * @returns {CircuitBreaker}
 */
export const createCircuitBreaker = (asyncFunction, customOptions = {}) => {
    const options = { ...defaultOptions, ...customOptions };
    const breaker = new CircuitBreaker(asyncFunction, options);

    breaker.fallback(() => ({
        error: 'Service temporarily unavailable (Circuit Breaker Open)',
        fallback: true,
    }));

    breaker.on('open', () => console.warn(`⚠️ [CircuitBreaker] Circuit OPENED for ${asyncFunction.name || 'anonymous function'}`));
    breaker.on('halfOpen', () => console.log(`🔄 [CircuitBreaker] Circuit HALF-OPEN testing for ${asyncFunction.name || 'anonymous function'}`));
    breaker.on('close', () => console.log(`✅ [CircuitBreaker] Circuit CLOSED for ${asyncFunction.name || 'anonymous function'}`));

    return breaker;
};
