import domUtils from '../src/utils/domUtils.js'

describe('DOMUtils', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="test-element">Test</div>
      <div id="hidden-element" style="display: none;">Hidden</div>
      <div id="visible-element">Visible</div>
    `
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
  })

  describe('getElementById', () => {
    test('should return element when found', () => {
      const element = domUtils.getElementById('test-element')
      expect(element).toBeTruthy()
      expect(element.id).toBe('test-element')
    })

    test('should return null when element not found', () => {
      const element = domUtils.getElementById('non-existent')
      expect(element).toBeNull()
    })

    test('should handle invalid ID gracefully', () => {
      const element = domUtils.getElementById(null)
      expect(element).toBeNull()
    })
  })

  describe('showElement', () => {
    test('should show element with animation', (done) => {
      const element = document.getElementById('hidden-element')
      domUtils.showElement('hidden-element', 'slideInLeft')

      expect(element.style.display).toBe('inherit')
      expect(element.classList.contains('animated')).toBe(true)
      expect(element.classList.contains('slideInLeft')).toBe(true)

      // Wait for animation to complete
      setTimeout(() => {
        expect(element.classList.contains('animated')).toBe(false)
        expect(element.classList.contains('slideInLeft')).toBe(false)
        done()
      }, 900)
    })

    test('should handle non-existent element gracefully', () => {
      expect(() => {
        domUtils.showElement('non-existent')
      }).not.toThrow()
    })
  })

  describe('hideElement', () => {
    test('should hide element with animation', (done) => {
      const element = document.getElementById('visible-element')
      domUtils.hideElement('visible-element', 'slideOutLeft')

      expect(element.classList.contains('animated')).toBe(true)
      expect(element.classList.contains('slideOutLeft')).toBe(true)

      // Wait for animation to complete
      setTimeout(() => {
        expect(element.classList.contains('animated')).toBe(false)
        expect(element.classList.contains('slideOutLeft')).toBe(false)
        expect(element.style.display).toBe('none')
        done()
      }, 900)
    })

    test('should handle non-existent element gracefully', () => {
      expect(() => {
        domUtils.hideElement('non-existent')
      }).not.toThrow()
    })
  })

  describe('addEventListener', () => {
    test('should add event listener successfully', () => {
      const element = document.getElementById('test-element')
      const handler = jest.fn()
      
      domUtils.addEventListener(element, 'click', handler)
      
      element.click()
      expect(handler).toHaveBeenCalled()
    })

    test('should handle invalid element gracefully', () => {
      const handler = jest.fn()
      domUtils.addEventListener(null, 'click', handler)
      // Should not throw
    })

    test('should handle invalid handler gracefully', () => {
      const element = document.getElementById('test-element')
      domUtils.addEventListener(element, 'click', null)
      // Should not throw
    })
  })

  describe('removeEventListener', () => {
    test('should remove event listener successfully', () => {
      const element = document.getElementById('test-element')
      const handler = jest.fn()
      
      domUtils.addEventListener(element, 'click', handler)
      domUtils.removeEventListener(element, 'click', handler)
      
      element.click()
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('setStyles', () => {
    test('should apply styles to element', () => {
      const element = document.getElementById('test-element')
      const styles = {
        color: 'red',
        fontSize: '16px'
      }
      
      domUtils.setStyles(element, styles)
      
      expect(element.style.color).toBe('red')
      expect(element.style.fontSize).toBe('16px')
    })

    test('should handle invalid element gracefully', () => {
      expect(() => {
        domUtils.setStyles(null, { color: 'red' })
      }).not.toThrow()
    })

    test('should handle invalid styles gracefully', () => {
      const element = document.getElementById('test-element')
      expect(() => {
        domUtils.setStyles(element, null)
      }).not.toThrow()
    })
  })

  describe('isVisible', () => {
    test('should return true for visible element', () => {
      const element = document.getElementById('visible-element')
      expect(domUtils.isVisible(element)).toBe(true)
    })

    test('should return false for hidden element', () => {
      const element = document.getElementById('hidden-element')
      expect(domUtils.isVisible(element)).toBe(false)
    })

    test('should return false for null element', () => {
      expect(domUtils.isVisible(null)).toBe(false)
    })
  })

  describe('debounce', () => {
    test('should debounce function calls', (done) => {
      const func = jest.fn()
      const debouncedFunc = domUtils.debounce(func, 100)
      
      // Call multiple times quickly
      debouncedFunc()
      debouncedFunc()
      debouncedFunc()
      
      // Function should not be called yet
      expect(func).not.toHaveBeenCalled()
      
      // Wait for debounce delay
      setTimeout(() => {
        expect(func).toHaveBeenCalledTimes(1)
        done()
      }, 150)
    })

    test('should pass arguments to debounced function', (done) => {
      const func = jest.fn()
      const debouncedFunc = domUtils.debounce(func, 100)
      
      debouncedFunc('arg1', 'arg2')
      
      setTimeout(() => {
        expect(func).toHaveBeenCalledWith('arg1', 'arg2')
        done()
      }, 150)
    })
  })
})