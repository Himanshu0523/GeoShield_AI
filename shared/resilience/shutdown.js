import { createLogger } from '../logging/logger.js';

/**
 * Registers graceful shutdown hooks for process SIGINT and SIGTERM signals.
 * @param {string} serviceName - Name of the service initializing shutdown
 * @param {Array<Function>} cleanupTasks - Async functions to run (DB disconnect, Kafka disconnect, HTTP server close)
 */
export function setupGracefulShutdown(serviceName, cleanupTasks = []) {
    const logger = createLogger(serviceName);

    const shutdown = async (signal) => {
        logger.info(`Received ${signal}. Starting graceful shutdown of ${serviceName}...`);
        
        const timeout = setTimeout(() => {
            logger.error(`Shutdown timed out after 10 seconds. Forcing process exit.`);
            process.exit(1);
        }, 10000);

        for (const task of cleanupTasks) {
            try {
                await task();
            } catch (err) {
                logger.error(`Error during shutdown cleanup task: ${err.message}`);
            }
        }

        clearTimeout(timeout);
        logger.info(`${serviceName} graceful shutdown complete. Exiting.`);
        process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}
