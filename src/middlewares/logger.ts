import expressWinston from 'express-winston';
import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logsDirectory = path.resolve(__dirname, '../../logs');
fs.mkdirSync(logsDirectory, { recursive: true });

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDirectory, 'request.log') }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDirectory, 'error.log') }),
  ],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
