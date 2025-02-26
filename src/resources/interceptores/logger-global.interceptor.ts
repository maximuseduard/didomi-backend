import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { path, method } = request;
    const { statusCode } = response;

    this.logger.log(`${method} ${path}`);

    const timeBefore = Date.now();

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - timeBefore;

        this.logger.log(`Response: status ${statusCode} - ${executionTime}ms`);
      })
    );
  }
}
