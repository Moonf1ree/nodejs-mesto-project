import AppError from './app-error';
import { STATUS_CODES } from '../constants';

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.UNAUTHORIZED);
  }
}

export default UnauthorizedError;
