import AppError from './app-error';
import { STATUS_CODES } from '../constants';

class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.FORBIDDEN);
  }
}

export default ForbiddenError;
