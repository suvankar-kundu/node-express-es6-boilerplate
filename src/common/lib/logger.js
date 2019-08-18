import 'winston-daily-rotate-file';
import winston, { Logger } from 'winston';

class ApplicationLogger extends Logger {
    constructor(logConfig) {
        super({
            transports: [
                new (winston.transports.Console)(logConfig.console),
                new (winston.transports.DailyRotateFile)(logConfig.file)
            ]
        });
    }
}

export default ApplicationLogger;