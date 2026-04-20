import AppError from './app-error';
import { STATUS_CODES } from '../constants';

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.NOT_FOUND);
  }
}

export default NotFoundError;
