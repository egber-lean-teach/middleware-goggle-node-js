/**
 * Common logger for Google AI middleware.
 *
 * This module provides consistent logging functionality used across both
 * Google AI SDK and Vertex AI SDK middleware implementations.
 */

export class Logger {
  private logLevel: string;

  constructor() {
    this.logLevel = process.env.REVENIUM_LOG_LEVEL?.toUpperCase() || "INFO";
  }

  private shouldLog(level: string): boolean {
    const levels = ["DEBUG", "INFO", "WARNING", "ERROR"];
    const currentLevel = levels.indexOf(this.logLevel);
    const messageLevel = levels.indexOf(level);
    return messageLevel >= currentLevel;
  }

  private formatMessage(
    level: string,
    message: string,
    ...args: any[]
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [Revenium] [${level}]`;

    if (args.length > 0) {
      return `${prefix} ${message} ${args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(" ")}`;
    }

    return `${prefix} ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog("DEBUG")) {
      console.debug(this.formatMessage("DEBUG", message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog("INFO")) {
      console.info(this.formatMessage("INFO", message, ...args));
    }
  }

  warning(message: string, ...args: any[]): void {
    if (this.shouldLog("WARNING")) {
      console.warn(this.formatMessage("WARNING", message, ...args));
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog("ERROR")) {
      console.error(this.formatMessage("ERROR", message, ...args));
    }
  }

  setLogLevel(level: string): void {
    const validLevels = ["DEBUG", "INFO", "WARNING", "ERROR"];
    if (validLevels.includes(level.toUpperCase())) {
      this.logLevel = level.toUpperCase();
    } else {
      this.warning(`Invalid log level: ${level}. Using INFO instead.`);
      this.logLevel = "INFO";
    }
  }

  getLogLevel(): string {
    return this.logLevel;
  }
}
