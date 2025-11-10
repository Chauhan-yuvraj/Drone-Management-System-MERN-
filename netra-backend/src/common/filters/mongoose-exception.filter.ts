// netra-backend/src/common/filters/mongoose-exception.filter.ts

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoServerError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check for the unique index error code (11000 or 11001)
    if (exception.code === 11000 || exception.code === 11001) {
      // We must handle the regex matching carefully due to TS/ESLint strictness
      // The MongoDB error message is often structured: "index: [field]_1 dup key: { [field]: ..."
      const fieldMatch = exception.message.match(/index: (.*?) dup key/);
      let fieldName = 'unknown field';

      if (fieldMatch && fieldMatch[1]) {
        // Safe access to array index 1
        fieldName = fieldMatch[1].split('_')[0].trim();
      }

      // 1. Create the specific NestJS exception (409 Conflict)
      const conflictException = new ConflictException(
        `${fieldName} already exists.`,
      );

      // 2. Send the correct 409 response using the exception's status and body
      response
        .status(conflictException.getStatus())
        .json(conflictException.getResponse());

      return; // Exit the filter after sending the 409 response
    }

    // Handle all other MongoServerErrors as a generic 500
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'A generic database error occurred.',
    });
  }
}
