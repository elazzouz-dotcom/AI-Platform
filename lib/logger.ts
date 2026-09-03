/**
 * Logging System
 * Centralized logging with levels
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private level = LogLevel.INFO;

  debug(message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  error(message: string, error?: any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  }

  setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.level = LogLevel[level.toUpperCase() as keyof typeof LogLevel];
  }
}

export const logger = new Logger();