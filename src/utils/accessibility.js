/**
 * Accessibility utilities for improved user experience
 */
class AccessibilityUtils {
  constructor() {
    this.logger = logger
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    this.setupKeyboardNavigation()
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Skip link functionality
      if (event.key === 'Tab' && event.shiftKey) {
        this.handleSkipLink(event)
      }
      
      // Escape key to close modals/overlays
      if (event.key === 'Escape') {
        this.handleEscapeKey(event)
      }
      
      // Arrow key navigation for custom components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowNavigation(event)
      }
    })
  }

  /**
   * Handle skip link functionality
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleSkipLink(event) {
    const skipLink = document.querySelector('.skip-link')
    if (skipLink && document.activeElement === skipLink) {
      event.preventDefault()
      const target = document.querySelector(skipLink.getAttribute('href'))
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  /**
   * Handle escape key to close modals
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleEscapeKey(event) {
    const modals = document.querySelectorAll('[role="dialog"], .modal, .overlay')
    modals.forEach(modal => {
      if (modal.style.display !== 'none' && modal.style.display !== '') {
        const closeButton = modal.querySelector('[aria-label*="close"], .close-button')
        if (closeButton) {
          closeButton.click()
        }
      }
    })
  }

  /**
   * Handle arrow key navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleArrowNavigation(event) {
    const currentElement = document.activeElement
    const container = currentElement.closest('[role="menu"], .navigation, .carousel')
    
    if (container) {
      const focusableElements = Array.from(container.querySelectorAll(this.focusableElements))
      const currentIndex = focusableElements.indexOf(currentElement)
      
      if (currentIndex !== -1) {
        let nextIndex = currentIndex
        
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            nextIndex = (currentIndex + 1) % focusableElements.length
            break
          case 'ArrowUp':
          case 'ArrowLeft':
            nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
            break
        }
        
        if (nextIndex !== currentIndex) {
          event.preventDefault()
          focusableElements[nextIndex].focus()
        }
      }
    }
  }

  /**
   * Announce content to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Priority level (polite, assertive)
   */
  announce(message, priority = 'polite') {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Trap focus within an element
   * @param {HTMLElement} element - Element to trap focus within
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(this.focusableElements)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    element.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    })
  }

  /**
   * Add skip link to page
   * @param {string} targetId - ID of target element
   * @param {string} text - Skip link text
   */
  addSkipLink(targetId, text = 'Skip to main content') {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.className = 'skip-link'
    skipLink.textContent = text
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      transition: top 0.3s;
    `
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px'
    })
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })
    
    document.body.insertBefore(skipLink, document.body.firstChild)
  }

  /**
   * Improve form accessibility
   * @param {HTMLFormElement} form - Form element
   */
  improveFormAccessibility(form) {
    const inputs = form.querySelectorAll('input, textarea, select')
    
    inputs.forEach(input => {
      // Add required indicator
      if (input.hasAttribute('required')) {
        const label = form.querySelector(`label[for="${input.id}"]`)
        if (label && !label.textContent.includes('*')) {
          label.innerHTML += ' <span aria-label="required">*</span>'
        }
      }
      
      // Add error handling
      input.addEventListener('invalid', () => {
        const errorMessage = input.validationMessage
        this.announce(`Error: ${errorMessage}`, 'assertive')
      })
    })
  }

  /**
   * Check color contrast ratio
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @returns {number} Contrast ratio
   */
  checkContrastRatio(foreground, background) {
    // Simplified contrast calculation
    // In a real implementation, you'd use a proper color contrast library
    const fgLuminance = this.getLuminance(foreground)
    const bgLuminance = this.getLuminance(background)
    
    const lighter = Math.max(fgLuminance, bgLuminance)
    const darker = Math.min(fgLuminance, bgLuminance)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Get luminance of a color
   * @param {string} color - Color value
   * @returns {number} Luminance value
   */
  getLuminance(color) {
    // Simplified luminance calculation
    // In a real implementation, you'd parse the color properly
    return 0.5 // Placeholder
  }
}

export default new AccessibilityUtils()