import DailyRotateFileTransport from "winston-daily-rotate-file";
import winston from "winston";

const {
  createLogger: createWinstonLogger,
  transports: { Console },
  format: { combine, timestamp, printf },
} = winston;

export default function createLogger(logConfig, DEFAULT_LABEL = "Application") {
  const logger = createWinstonLogger({ json: false });
  const applicationLogFormat = printf((info) => {
    if (/error/.test(info.level)) {
      return `${info.timestamp}-${info.level}:${info.label || DEFAULT_LABEL}:${
        info.message
      },${info.error instanceof Error ? info.error.message : ""}`;
    } else {
      return `${info.timestamp}-${info.level}:${info.label || DEFAULT_LABEL}:${
        info.message
      }`;
    }
  });

  if (logConfig.console && logConfig.console.enabled === true) {
    logger.add(
      new Console({
        level: logConfig.console.level || "debug",
        format: combine(timestamp(), applicationLogFormat),
      })
    );
  }

  if (logConfig.file && logConfig.file.enabled === true) {
    logger.add(
      new DailyRotateFileTransport({
        level: logConfig.file.level || "info",
        filename: logConfig.file.filename,
        datePattern: logConfig.file.datePattern || "YYYY-MM-DD",
        format: combine(timestamp(), applicationLogFormat),
      })
    );
  }

  logger.stream = function (label) {
    return {
      write(message) {
        logger.info({ label, message: message.trim() });
      },
    };
  };

  return logger;
}
