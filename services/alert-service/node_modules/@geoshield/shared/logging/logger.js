import winston from 'winston';

const { combine, timestamp, json, errors, colorize, simple } = winston.format;

export const createLogger = (serviceName) => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: { service: serviceName },
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      errors({ stack: true }),
      json()
    ),
    transports: [
      new winston.transports.Console({
        format: process.env.NODE_ENV === 'production' 
          ? combine(timestamp(), json()) 
          : combine(timestamp({ format: 'HH:mm:ss' }), colorize(), simple())
      })
    ]
  });
};
