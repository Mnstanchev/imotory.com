import { NextRequest, NextResponse } from 'next/server';
import logger from '../logger';

export async function requestLogger(req: NextRequest) {
  const startTime = Date.now();
  const { method, url, headers } = req;
  
  // Log request
  logger.info({
    type: 'request',
    method,
    url,
    userAgent: headers.get('user-agent'),
    referer: headers.get('referer'),
  });

  // Process the request
  const response = NextResponse.next();

  // Log response
  const duration = Date.now() - startTime;
  logger.info({
    type: 'response',
    method,
    url,
    status: response.status,
    duration: `${duration}ms`,
  });

  return response;
}