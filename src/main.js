import App from './components/App.js'
import LennyApp from './components/LennyApp.js'
import logger from './utils/logger.js'

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
      this.logger.info('Starting main application...')
      
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
      
      // Setup global error handling
      this.setupErrorHandling()
      
      this.logger.info('Application startup completed successfully')
      
    } catch (error) {
      this.logger.error('Failed to initialize application', error)
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