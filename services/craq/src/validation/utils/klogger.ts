import { createLogger, format, transports } from "winston";

// Setup logging
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

export function getLogger(logLevel: string) {
  return createLogger({
    format: format.combine(format.timestamp(), format.json()),
    levels: logLevels,
    transports: [
      new transports.File({ filename: "logs/info.log", level: "info" }),
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" }),
      new transports.Console({ level: logLevel }),
    ],
    exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
    rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
  });
}
