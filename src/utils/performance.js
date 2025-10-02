/**
 * Performance monitoring and analytics utilities
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.logger = logger
    this.observers = new Map()
  }

  /**
   * Start performance timing
   * @param {string} name - Name of the operation
   * @returns {number} Start time
   */
  startTiming(name) {
    const startTime = performance.now()
    this.metrics.set(name, { startTime, endTime: null })
    return startTime
  }

  /**
   * End performance timing
   * @param {string} name - Name of the operation
   * @returns {number} Duration in milliseconds
   */
  endTiming(name) {
    const metric = this.metrics.get(name)
    if (!metric) {
      this.logger.warn(`No timing found for operation: ${name}`)
      return 0
    }

    const endTime = performance.now()
    const duration = endTime - metric.startTime
    
    metric.endTime = endTime
    metric.duration = duration

    this.logger.performance(name, metric.startTime)
    return duration
  }

  /**
   * Measure Core Web Vitals
   */
  measureWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.logger.info(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.logger.info(`FID: ${entry.processingStart - entry.startTime}ms`)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.logger.info(`CLS: ${clsValue}`)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  /**
   * Monitor memory usage
   */
  monitorMemory() {
    if ('memory' in performance) {
      const memory = performance.memory
      this.logger.info(`Memory Usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB / ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`)
    }
  }

  /**
   * Track user interactions
   * @param {string} action - Action performed
   * @param {Object} data - Additional data
   */
  trackInteraction(action, data = {}) {
    const interaction = {
      action,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...data
    }
    
    this.logger.debug('User interaction', interaction)
    
    // Send to analytics service if configured
    if (window.gtag) {
      window.gtag('event', action, data)
    }
  }

  /**
   * Monitor page load performance
   */
  monitorPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        if (navigation) {
          this.logger.info(`Page Load Time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`)
          this.logger.info(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`)
        }
        this.monitorMemory()
      }, 0)
    })
  }

  /**
   * Get performance summary
   * @returns {Object} Performance summary
   */
  getSummary() {
    const summary = {}
    this.metrics.forEach((metric, name) => {
      if (metric.duration) {
        summary[name] = metric.duration
      }
    })
    return summary
  }
}

export default new PerformanceMonitor()