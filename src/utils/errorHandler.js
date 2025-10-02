/**
 * Enhanced error handling and recovery system
 */
class ErrorHandler {
  constructor() {
    this.logger = logger
    this.errorCounts = new Map()
    this.maxErrors = 10
    this.errorWindow = 60000 // 1 minute
    this.setupGlobalHandlers()
  }

  /**
   * Setup global error handlers
   */
  setupGlobalHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Unhandled Promise Rejection', event.reason, {
        type: 'promise',
        stack: event.reason?.stack
      })
    })

    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError('Global JavaScript Error', event.error, {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message
      })
    })

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError('Resource Loading Error', null, {
          type: 'resource',
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
          error: event.error
        })
      }
    }, true)
  }

  /**
   * Handle application errors
   * @param {string} context - Error context
   * @param {Error} error - Error object
   * @param {Object} metadata - Additional error metadata
   */
  handleError(context, error, metadata = {}) {
    const errorInfo = {
      context,
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata
    }

    // Rate limiting
    if (this.shouldThrottleError(context)) {
      return
    }

    // Log error
    this.logger.error(`Error in ${context}: ${errorInfo.message}`, error)

    // Send to error reporting service
    this.reportError(errorInfo)

    // Attempt recovery
    this.attemptRecovery(context, error, metadata)
  }

  /**
   * Check if error should be throttled
   * @param {string} context - Error context
   * @returns {boolean} True if should throttle
   */
  shouldThrottleError(context) {
    const now = Date.now()
    const key = context
    const errors = this.errorCounts.get(key) || []
    
    // Remove old errors
    const recentErrors = errors.filter(time => now - time < this.errorWindow)
    
    if (recentErrors.length >= this.maxErrors) {
      return true
    }
    
    recentErrors.push(now)
    this.errorCounts.set(key, recentErrors)
    return false
  }

  /**
   * Report error to external service
   * @param {Object} errorInfo - Error information
   */
  reportError(errorInfo) {
    // Send to error reporting service (Sentry, LogRocket, etc.)
    if (window.Sentry) {
      window.Sentry.captureException(new Error(errorInfo.message), {
        extra: errorInfo
      })
    }

    // Send to custom error endpoint
    if (navigator.sendBeacon) {
      const errorData = JSON.stringify(errorInfo)
      navigator.sendBeacon('/api/errors', errorData)
    }
  }

  /**
   * Attempt error recovery
   * @param {string} context - Error context
   * @param {Error} error - Error object
   * @param {Object} metadata - Error metadata
   */
  attemptRecovery(context, error, metadata) {
    switch (context) {
      case 'Resource Loading Error':
        this.recoverResourceError(metadata)
        break
      case 'Global JavaScript Error':
        this.recoverJavaScriptError(error, metadata)
        break
      case 'Unhandled Promise Rejection':
        this.recoverPromiseError(error)
        break
      default:
        this.recoverGenericError(context, error)
    }
  }

  /**
   * Recover from resource loading errors
   * @param {Object} metadata - Error metadata
   */
  recoverResourceError(metadata) {
    if (metadata.tagName === 'IMG') {
      // Replace broken image with placeholder
      const img = document.querySelector(`img[src="${metadata.src}"]`)
      if (img) {
        img.src = '/images/placeholder.png'
        img.alt = 'Image failed to load'
      }
    } else if (metadata.tagName === 'SCRIPT') {
      // Retry script loading
      setTimeout(() => {
        const script = document.createElement('script')
        script.src = metadata.src
        script.onerror = () => {
          this.logger.warn(`Failed to retry loading script: ${metadata.src}`)
        }
        document.head.appendChild(script)
      }, 1000)
    }
  }

  /**
   * Recover from JavaScript errors
   * @param {Error} error - Error object
   * @param {Object} metadata - Error metadata
   */
  recoverJavaScriptError(error, metadata) {
    // Try to reload the page if it's a critical error
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      this.logger.warn('Chunk loading error detected, reloading page')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  /**
   * Recover from promise errors
   * @param {Error} error - Error object
   */
  recoverPromiseError(error) {
    // Show user-friendly error message
    this.showUserError('Something went wrong. Please try again.')
  }

  /**
   * Recover from generic errors
   * @param {string} context - Error context
   * @param {Error} error - Error object
   */
  recoverGenericError(context, error) {
    this.showUserError(`An error occurred in ${context}. Please refresh the page.`)
  }

  /**
   * Show user-friendly error message
   * @param {string} message - Error message
   */
  showUserError(message) {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'error-notification'
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `
    errorDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          margin-left: 10px;
        ">×</button>
      </div>
    `
    
    document.body.appendChild(errorDiv)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove()
      }
    }, 5000)
  }

  /**
   * Wrap async functions with error handling
   * @param {Function} fn - Async function to wrap
   * @param {string} context - Error context
   * @returns {Function} Wrapped function
   */
  wrapAsync(fn, context) {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        this.handleError(context, error, { args })
        throw error
      }
    }
  }

  /**
   * Wrap sync functions with error handling
   * @param {Function} fn - Function to wrap
   * @param {string} context - Error context
   * @returns {Function} Wrapped function
   */
  wrapSync(fn, context) {
    return (...args) => {
      try {
        return fn(...args)
      } catch (error) {
        this.handleError(context, error, { args })
        throw error
      }
    }
  }
}

export default new ErrorHandler()