
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { timestamp } from 'rxjs';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {


    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();


        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let details: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();
            message =
                typeof responseBody === 'string'
                    ? responseBody
                    : (responseBody as any).message || message;
            details = (responseBody as any).details || null;

        }

        response.status(status).json({
            sucess: false,
            statusCode: status,
            message,
            details,
            path: request.url,
            timestamp: new Date().toISOString()



        })

    }






}
