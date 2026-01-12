import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status: number;
    let errorResponse: ApiError;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const error = exception.getResponse();
      
      if (typeof error === 'object' && error !== null) {
        errorResponse = {
          code: typeof error['error'] === 'string' ? error['error'] : 'INTERNAL_ERROR',
          message: typeof error['message'] === 'string' ? error['message'] : exception.message,
          details: error['details'] || error
        };
      } else {
        errorResponse = {
          code: exception.constructor.name,
          message: exception.message,
          details: error
        };
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (exception as Error).message : undefined
      };
    }

    response.status(status).json(errorResponse);
  }
}