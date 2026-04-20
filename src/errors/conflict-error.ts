import AppError from './app-error';
import { STATUS_CODES } from '../constants';

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.CONFLICT);
  }
}

export default ConflictError;
