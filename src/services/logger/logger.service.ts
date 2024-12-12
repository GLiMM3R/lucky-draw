// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private logger: winston.Logger;

    constructor() {
        const transport = new DailyRotateFile({
            filename: '../logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '50m',
        });

        this.logger = winston.createLogger({
            level: 'info', // Set your desired log level
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [transport],
        });
    }

    log(message: string) {
        this.logger.log('info', message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, trace);
    }
}
