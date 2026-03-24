import { createLogger, format } from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Simple console logger for Edge Runtime
const edgeLogger = {
  error: (data: any) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      ...data
    }));
  },
  warn: (data: any) => {
    console.warn(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      ...data
    }));
  },
  info: (data: any) => {
    console.info(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      ...data
    }));
  },
  http: (data: any) => {
    console.log(JSON.stringify({
      level: 'http',
      timestamp: new Date().toISOString(),
      ...data
    }));
  },
  debug: (data: any) => {
    console.debug(JSON.stringify({
      level: 'debug',
      timestamp: new Date().toISOString(),
      ...data
    }));
  }
};

// Helper functions for common log patterns
export const logError = (error: Error, context?: string) => {
  edgeLogger.error({
    message: error.message,
    stack: error.stack,
    context,
  });
};

export const logAPIError = (error: Error, req: Request, context?: string) => {
  edgeLogger.error({
    message: error.message,
    stack: error.stack,
    context,
    method: req.method,
    url: req.url,
  });
};

export const logInfo = (message: string, metadata?: any) => {
  edgeLogger.info({
    message,
    ...metadata,
  });
};

export const logWarning = (message: string, metadata?: any) => {
  edgeLogger.warn({
    message,
    ...metadata,
  });
};

export const logDebug = (message: string, metadata?: any) => {
  edgeLogger.debug({
    message,
    ...metadata,
  });
};

export default edgeLogger;