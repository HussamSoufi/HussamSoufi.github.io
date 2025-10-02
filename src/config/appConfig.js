/**
 * Application configuration management
 */
class AppConfig {
  constructor() {
    this.config = {
      // Environment
      environment: process.env.NODE_ENV || 'development',
      
      // API Configuration
      api: {
        baseURL: process.env.API_BASE_URL || '',
        timeout: 10000,
        retries: 3
      },
      
      // Animation Configuration
      animations: {
        duration: 800,
        easing: 'ease-in-out',
        enableReducedMotion: this.shouldReduceMotion()
      },
      
      // Logging Configuration
      logging: {
        level: process.env.LOG_LEVEL || 'INFO',
        enableConsole: process.env.NODE_ENV !== 'production',
        enableRemote: false,
        remoteEndpoint: ''
      },
      
      // Performance Configuration
      performance: {
        enableMonitoring: true,
        enableWebVitals: true,
        enableMemoryMonitoring: false,
        sampleRate: 1.0
      },
      
      // Security Configuration
      security: {
        enableCSRF: true,
        enableXSSProtection: true,
        enableContentSecurityPolicy: true,
        allowedOrigins: ['localhost:3000', '127.0.0.1:3000']
      },
      
      // Feature Flags
      features: {
        enableParticles: true,
        enableAnimations: true,
        enableAnalytics: false,
        enableErrorReporting: true
      },
      
      // UI Configuration
      ui: {
        theme: 'light',
        language: 'en',
        enableAccessibility: true,
        enableKeyboardNavigation: true
      }
    }
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} True if reduced motion is preferred
   */
  shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Get configuration value
   * @param {string} path - Dot notation path to config value
   * @returns {*} Configuration value
   */
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config)
  }

  /**
   * Set configuration value
   * @param {string} path - Dot notation path to config value
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config)
    target[lastKey] = value
  }

  /**
   * Update configuration from environment variables
   */
  updateFromEnvironment() {
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('APP_')) {
        const configKey = key.replace('APP_', '').toLowerCase()
        this.set(configKey, process.env[key])
      }
    })
  }

  /**
   * Validate configuration
   * @returns {Array} Array of validation errors
   */
  validate() {
    const errors = []
    
    // Validate required fields
    if (!this.config.environment) {
      errors.push('Environment is required')
    }
    
    if (this.config.api.timeout < 1000) {
      errors.push('API timeout must be at least 1000ms')
    }
    
    if (this.config.performance.sampleRate < 0 || this.config.performance.sampleRate > 1) {
      errors.push('Performance sample rate must be between 0 and 1')
    }
    
    return errors
  }

  /**
   * Get configuration for current environment
   * @returns {Object} Environment-specific configuration
   */
  getEnvironmentConfig() {
    const env = this.config.environment
    const baseConfig = { ...this.config }
    
    if (env === 'production') {
      baseConfig.logging.enableConsole = false
      baseConfig.logging.level = 'ERROR'
      baseConfig.features.enableAnalytics = true
      baseConfig.performance.enableMemoryMonitoring = false
    } else if (env === 'development') {
      baseConfig.logging.enableConsole = true
      baseConfig.logging.level = 'DEBUG'
      baseConfig.features.enableAnalytics = false
      baseConfig.performance.enableMemoryMonitoring = true
    }
    
    return baseConfig
  }
}

export default new AppConfig()