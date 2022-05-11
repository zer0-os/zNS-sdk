export enum LoggingLevel {
  Debug,
  Info,
  Warning,
  Error,
}

export interface Logger {
  log: (level: LoggingLevel, message: string | unknown) => void;
  debug: (message: string | unknown) => void;
  warning: (message: string | unknown) => void;
  error: (message: string | unknown) => void;
}

let currentLoggingLevel = LoggingLevel.Info;

export class ConsoleLogger implements Logger {
  constructor() {}

  private logFunctions = {
    [LoggingLevel.Debug]: console.debug,
    [LoggingLevel.Info]: console.log,
    [LoggingLevel.Warning]: console.warn,
    [LoggingLevel.Error]: console.error,
  };

  log = (level: LoggingLevel, message: string | unknown) => {
    // Filter out log messages below our current level
    if (level < currentLoggingLevel) {
      return;
    }

    this.logFunctions[level](message);
  };

  debug = (message: string | unknown) => this.log(LoggingLevel.Debug, message);

  info = (message: string | unknown) => this.log(LoggingLevel.Info, message);

  warning = (message: string | unknown) =>
    this.log(LoggingLevel.Warning, message);

  error = (message: string | unknown) => this.log(LoggingLevel.Error, message);
}

let currentLogger: Logger = new ConsoleLogger();

export const getLogger = (): Logger => {
  return currentLogger;
};

export const setLogger = (logger: Logger) => {
  currentLogger = logger;
};

export const getCurrentLoggingLevel = () => {
  return currentLoggingLevel;
};

export const setCurrentLoggingLevel = (level: LoggingLevel) => {
  currentLoggingLevel = level;
};
