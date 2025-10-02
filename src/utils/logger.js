/**
 * Logger utility for consistent logging across the application
 */
class Logger {
  constructor() {
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    }
    this.currentLevel = this.levels.INFO
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  /**
   * Set the logging level
   * @param {string} level - The logging level (ERROR, WARN, INFO, DEBUG)
   */
  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.currentLevel = this.levels[level]
    }
  }

  /**
   * Log an error message
   * @param {string} message - The error message
   * @param {Error} error - Optional error object
   */
  error(message, error = null) {
    if (this.currentLevel >= this.levels.ERROR) {
      const timestamp = new Date().toISOString()
      console.error(`[${timestamp}] ERROR: ${message}`)
      if (error) {
        console.error(error)
      }
    }
  }

  /**
   * Log a warning message
   * @param {string} message - The warning message
   */
  warn(message) {
    if (this.currentLevel >= this.levels.WARN) {
      const timestamp = new Date().toISOString()
      console.warn(`[${timestamp}] WARN: ${message}`)
    }
  }

  /**
   * Log an info message
   * @param {string} message - The info message
   */
  info(message) {
    if (this.currentLevel >= this.levels.INFO) {
      const timestamp = new Date().toISOString()
      console.info(`[${timestamp}] INFO: ${message}`)
    }
  }

  /**
   * Log a debug message
   * @param {string} message - The debug message
   */
  debug(message) {
    if (this.currentLevel >= this.levels.DEBUG && !this.isProduction) {
      const timestamp = new Date().toISOString()
      console.debug(`[${timestamp}] DEBUG: ${message}`)
    }
  }

  /**
   * Log performance metrics
   * @param {string} operation - The operation name
   * @param {number} startTime - The start time
   */
  performance(operation, startTime) {
    const duration = performance.now() - startTime
    this.info(`Performance: ${operation} took ${duration.toFixed(2)}ms`)
  }
}

// Create singleton instance
const logger = new Logger()

export default logger