import * as consola from "consola";

const logger = consola.default.create({
  level: consola.LogLevel.Trace,
});

export const getLogger = (tag?: string): consola.Consola => {
  if (tag) {
    return logger.withTag(tag);
  }
  return logger;
};

const setLogLevel = (level?: consola.LogLevel) => {
  if (level === undefined || typeof level != "number") {
    console.log("provide a number");
    Object.entries(consola.LogLevel).forEach(([key, value]) => {
      console.log(`${key}=${value}`);
    });
    return;
  }

  logger.level = level;
};

// eslint-disable-next-line
(global as any).setZnsSDKLogLevel = setLogLevel;
