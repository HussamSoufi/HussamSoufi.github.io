import logger from './logger.js'

/**
 * DOM utility functions for consistent DOM manipulation
 */
class DOMUtils {
  constructor() {
    this.animationDuration = 800
    this.logger = logger
  }

  /**
   * Safely get an element by ID
   * @param {string} id - The element ID
   * @returns {HTMLElement|null} The element or null if not found
   */
  getElementById(id) {
    try {
      const element = document.getElementById(id)
      if (!element) {
        this.logger.warn(`Element with ID '${id}' not found`)
      }
      return element
    } catch (error) {
      this.logger.error(`Error getting element by ID '${id}'`, error)
      return null
    }
  }

  /**
   * Show an element with animation
   * @param {string} elementId - The element ID
   * @param {string} animationClass - The animation class to apply
   */
  showElement(elementId, animationClass = 'slideInLeft') {
    const element = this.getElementById(elementId)
    if (!element) return

    try {
      element.style.display = 'inherit'
      element.classList.add('animated', animationClass)
      
      setTimeout(() => {
        element.classList.remove('animated', animationClass)
      }, this.animationDuration)

      this.logger.debug(`Showed element: ${elementId}`)
    } catch (error) {
      this.logger.error(`Error showing element '${elementId}'`, error)
    }
  }

  /**
   * Hide an element with animation
   * @param {string} elementId - The element ID
   * @param {string} animationClass - The animation class to apply
   */
  hideElement(elementId, animationClass = 'slideOutLeft') {
    const element = this.getElementById(elementId)
    if (!element) return

    try {
      element.classList.add('animated', animationClass)
      
      setTimeout(() => {
        element.classList.remove('animated', animationClass)
        element.style.display = 'none'
      }, this.animationDuration)

      this.logger.debug(`Hid element: ${elementId}`)
    } catch (error) {
      this.logger.error(`Error hiding element '${elementId}'`, error)
    }
  }

  /**
   * Add event listener with error handling
   * @param {HTMLElement} element - The element to attach the listener to
   * @param {string} event - The event type
   * @param {Function} handler - The event handler
   */
  addEventListener(element, event, handler) {
    if (!element || typeof handler !== 'function') {
      this.logger.warn('Invalid element or handler for addEventListener')
      return
    }

    try {
      element.addEventListener(event, handler)
      this.logger.debug(`Added ${event} listener to element`)
    } catch (error) {
      this.logger.error(`Error adding event listener`, error)
    }
  }

  /**
   * Remove event listener with error handling
   * @param {HTMLElement} element - The element to remove the listener from
   * @param {string} event - The event type
   * @param {Function} handler - The event handler
   */
  removeEventListener(element, event, handler) {
    if (!element || typeof handler !== 'function') {
      this.logger.warn('Invalid element or handler for removeEventListener')
      return
    }

    try {
      element.removeEventListener(event, handler)
      this.logger.debug(`Removed ${event} listener from element`)
    } catch (error) {
      this.logger.error(`Error removing event listener`, error)
    }
  }

  /**
   * Set CSS styles with error handling
   * @param {HTMLElement} element - The element to style
   * @param {Object} styles - Object containing CSS properties
   */
  setStyles(element, styles) {
    if (!element || typeof styles !== 'object') {
      this.logger.warn('Invalid element or styles object')
      return
    }

    try {
      Object.assign(element.style, styles)
      this.logger.debug('Applied styles to element')
    } catch (error) {
      this.logger.error('Error applying styles', error)
    }
  }

  /**
   * Check if element is visible
   * @param {HTMLElement} element - The element to check
   * @returns {boolean} True if element is visible
   */
  isVisible(element) {
    if (!element) return false
    
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  }

  /**
   * Debounce function for performance optimization
   * @param {Function} func - The function to debounce
   * @param {number} wait - The delay in milliseconds
   * @returns {Function} The debounced function
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Create singleton instance
const domUtils = new DOMUtils()

export default domUtils