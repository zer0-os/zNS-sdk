import { Consola, LogLevel } from "consola";

// Default level is Info
const logger = new Consola({ level: 3 });

export const getLogger = (tag?: string): Consola => {
  if (tag) {
    return logger.withTag(tag);
  }
  return logger;
};

export const setLogLevel = (level?: LogLevel): void => {
  if (level === undefined || typeof level != "number") {
    console.log("Provide a number");
    Object.entries(LogLevel).forEach(([key, value]) => {
      console.log(`${key}=${value}`);
    });
    return;
  }

  logger.level = level;
};

// eslint-disable-next-line
(global as any).setZAuctionSDKLogLevel = setLogLevel;
