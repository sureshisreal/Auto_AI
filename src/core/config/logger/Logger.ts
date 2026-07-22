import winston from 'winston';
import path from 'path';
import { FilePaths } from '../../config/constants/FilePaths';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const logFileName = `app-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(FilePaths.LOGS, logFileName);

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: { service: 'playwright-automation' },
      transports: [
        new winston.transports.File({
          filename: logFilePath,
          level: 'info',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          format: logFormat
        }),
        new winston.transports.File({
          filename: path.join(FilePaths.LOGS, 'error.log'),
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5,
          format: logFormat
        })
      ]
    });

    // If we're not in production, log to the console
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      );
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, meta?: object): void {
    this.logger.info(message, meta);
  }

  public debug(message: string, meta?: object): void {
    this.logger.debug(message, meta);
  }

  public warn(message: string, meta?: object): void {
    this.logger.warn(message, meta);
  }

  public error(message: string, meta?: object): void {
    this.logger.error(message, meta);
  }
}

export default Logger.getInstance();
