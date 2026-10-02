import { Kafka } from 'kafkajs';
import { createLogger } from '../logging/logger.js';

const logger = createLogger('shared-kafka-resilience');

/**
 * Wraps a Kafka message handler with automatic retries and Dead-Letter Queue (DLQ) routing upon repeated failure.
 * @param {Object} consumer - KafkaJS consumer instance
 * @param {Object} producer - KafkaJS producer instance
 * @param {string} topic - Topic being consumed
 * @param {Function} handler - Async message processor function (payload) => void
 * @param {Object} options - Retry & DLQ options
 */
export async function consumeWithDLQ(consumer, producer, topic, handler, options = {}) {
    const maxRetries = options.maxRetries || 3;
    const dlqTopic = options.dlqTopic || `${topic}.dlq`;

    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic: msgTopic, partition, message }) => {
            const rawValue = message.value ? message.value.toString() : '';
            let payload;
            try {
                payload = JSON.parse(rawValue);
            } catch (parseErr) {
                logger.error(`Failed to parse Kafka message JSON on topic ${msgTopic}: ${parseErr.message}`);
                await sendToDLQ(producer, dlqTopic, rawValue, parseErr.message, 0);
                return;
            }

            let attempt = 0;
            let success = false;
            let lastError = null;

            while (attempt < maxRetries && !success) {
                attempt++;
                try {
                    await handler(payload, { topic: msgTopic, partition, offset: message.offset, attempt });
                    success = true;
                } catch (err) {
                    lastError = err;
                    logger.warn(`Handler error on topic ${msgTopic} (Attempt ${attempt}/${maxRetries}): ${err.message}`);
                    if (attempt < maxRetries) {
                        const backoffMs = Math.pow(2, attempt) * 500;
                        await new Promise((res) => setTimeout(res, backoffMs));
                    }
                }
            }

            if (!success) {
                logger.error(`Exhausted retries (${maxRetries}) for message on ${msgTopic}. Forwarding to DLQ: ${dlqTopic}`);
                await sendToDLQ(producer, dlqTopic, payload, lastError ? lastError.message : 'Unknown error', attempt);
            }
        },
    });
}

async function sendToDLQ(producer, dlqTopic, originalPayload, errorMessage, attempts) {
    try {
        const dlqEnvelope = {
            originalPayload,
            error: errorMessage,
            attemptsCount: attempts,
            failedAt: new Date().toISOString(),
        };

        await producer.send({
            topic: dlqTopic,
            messages: [{ value: JSON.stringify(dlqEnvelope) }],
        });
        logger.info(`Successfully dispatched failed payload to DLQ topic: ${dlqTopic}`);
    } catch (dlqErr) {
        logger.error(`CRITICAL: Failed to publish message to DLQ ${dlqTopic}: ${dlqErr.message}`);
    }
}
