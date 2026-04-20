import AppError from './app-error';
import { STATUS_CODES } from '../constants';

class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST);
  }
}

export default BadRequestError;
