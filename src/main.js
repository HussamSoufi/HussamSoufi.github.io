import App from './components/App.js'
import LennyApp from './components/LennyApp.js'
import logger from './utils/logger.js'
import performanceMonitor from './utils/performance.js'
import errorHandler from './utils/errorHandler.js'
import accessibilityUtils from './utils/accessibility.js'
import appConfig from './config/appConfig.js'

/**
 * Main entry point for the application
 */
class Main {
  constructor() {
    this.logger = logger
    this.app = null
    this.lennyApp = null
  }

  /**
   * Initialize the main application
   */
  async init() {
    try {
      const startTime = performanceMonitor.startTiming('app-init')
      
      this.logger.info('Starting main application...')
      
      // Initialize configuration
      appConfig.updateFromEnvironment()
      const configErrors = appConfig.validate()
      if (configErrors.length > 0) {
        this.logger.warn('Configuration validation errors:', configErrors)
      }
      
      // Setup accessibility features
      if (appConfig.get('ui.enableAccessibility')) {
        accessibilityUtils.addSkipLink('main-content', 'Skip to main content')
        this.logger.info('Accessibility features enabled')
      }
      
      // Setup performance monitoring
      if (appConfig.get('performance.enableMonitoring')) {
        performanceMonitor.monitorPageLoad()
        if (appConfig.get('performance.enableWebVitals')) {
          performanceMonitor.measureWebVitals()
        }
        this.logger.info('Performance monitoring enabled')
      }
      
      // Determine which app to initialize based on current page
      const currentPath = window.location.pathname
      
      if (currentPath.includes('/lenny/')) {
        this.lennyApp = new LennyApp()
        await this.lennyApp.init()
        this.logger.info('Lenny application initialized')
      } else {
        this.app = new App()
        await this.app.init()
        this.logger.info('Main application initialized')
      }
      
      // Track successful initialization
      performanceMonitor.trackInteraction('app-initialized', {
        path: currentPath,
        timestamp: Date.now()
      })
      
      performanceMonitor.endTiming('app-init')
      this.logger.info('Application startup completed successfully')
      
    } catch (error) {
      errorHandler.handleError('Application Initialization', error)
      this.showErrorFallback()
    }
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logger.error('Unhandled promise rejection', event.reason)
      event.preventDefault()
    })

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
      this.logger.error('Global JavaScript error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    })

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logger.error('Resource loading error', {
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
          error: event.error
        })
      }
    }, true)
  }

  /**
   * Show error fallback UI
   */
  showErrorFallback() {
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `
    errorDiv.innerHTML = `
      <h2>Application Error</h2>
      <p>Something went wrong. Please refresh the page.</p>
      <button onclick="location.reload()" style="
        background: white;
        color: #ff4444;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      ">Refresh Page</button>
    `
    
    document.body.appendChild(errorDiv)
  }

  /**
   * Cleanup method
   */
  destroy() {
    try {
      if (this.app) {
        this.app.destroy()
      }
      if (this.lennyApp) {
        this.lennyApp.destroy()
      }
      this.logger.info('Main application destroyed')
    } catch (error) {
      this.logger.error('Error during cleanup', error)
    }
  }
}

// Initialize the application when DOM is ready
const main = new Main()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => main.init())
} else {
  main.init()
}

// Export for testing
export default Main