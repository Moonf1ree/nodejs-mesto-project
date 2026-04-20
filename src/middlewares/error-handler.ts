import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../constants';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
};

export default errorHandler;
