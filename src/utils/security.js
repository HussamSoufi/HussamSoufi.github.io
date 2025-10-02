/**
 * Security utilities for input validation and sanitization
 */
class SecurityUtils {
  constructor() {
    this.logger = logger
  }

  /**
   * Sanitize HTML content to prevent XSS
   * @param {string} input - The input string to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeHTML(input) {
    if (typeof input !== 'string') return ''
    
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  isValidURL(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Escape special characters for safe attribute values
   * @param {string} input - Input string
   * @returns {string} Escaped string
   */
  escapeAttribute(input) {
    if (typeof input !== 'string') return ''
    return input
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  /**
   * Generate CSRF token
   * @returns {string} CSRF token
   */
  generateCSRFToken() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
}

export default new SecurityUtils()