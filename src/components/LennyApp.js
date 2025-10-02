import logger from '../utils/logger.js'
import domUtils from '../utils/domUtils.js'

/**
 * Lenny application class for managing the Lenny portfolio section
 */
class LennyApp {
  constructor() {
    this.logger = logger
    this.domUtils = domUtils
    this.isInitialized = false
    this.loadingStartTime = performance.now()
    this.windowWidth = window.innerWidth
    
    // Bind methods to preserve context
    this.handleScroll = this.handleScroll.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.magnify = this.magnify.bind(this)
    this.closeMagnify = this.closeMagnify.bind(this)
  }

  /**
   * Initialize the Lenny application
   */
  async init() {
    try {
      this.logger.info('Initializing Lenny application...')
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve)
        })
      }

      this.setupEventListeners()
      this.hideLoadingScreen()
      this.setupSmoothScrolling()
      
      this.isInitialized = true
      this.logger.info('Lenny application initialized successfully')
      
    } catch (error) {
      this.logger.error('Failed to initialize Lenny application', error)
      throw error
    }
  }

  /**
   * Setup event listeners for the Lenny application
   */
  setupEventListeners() {
    try {
      // Scroll handling with debouncing for performance
      const debouncedScrollHandler = this.domUtils.debounce(this.handleScroll, 16)
      window.addEventListener('scroll', debouncedScrollHandler, { passive: true })

      // Resize handling with debouncing
      const debouncedResizeHandler = this.domUtils.debounce(this.handleResize, 250)
      window.addEventListener('resize', debouncedResizeHandler)

      // Smooth scrolling for anchor links
      this.setupSmoothScrolling()

      this.logger.debug('Lenny event listeners setup completed')
    } catch (error) {
      this.logger.error('Error setting up Lenny event listeners', error)
    }
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    try {
      const links = document.querySelectorAll('a[href*="#"]')
      
      links.forEach(link => {
        this.domUtils.addEventListener(link, 'click', (event) => {
          const href = link.getAttribute('href')
          if (href && href !== '#') {
            event.preventDefault()
            this.smoothScrollTo(href)
          }
        })
      })

      this.logger.debug('Smooth scrolling setup completed')
    } catch (error) {
      this.logger.error('Error setting up smooth scrolling', error)
    }
  }

  /**
   * Smooth scroll to target element
   * @param {string} target - The target selector
   */
  smoothScrollTo(target) {
    try {
      const targetElement = document.querySelector(target)
      if (targetElement) {
        const startTime = performance.now()
        
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

        // Log performance
        setTimeout(() => {
          this.logger.performance('Smooth scroll', startTime)
        }, 100)
      }
    } catch (error) {
      this.logger.error('Error during smooth scroll', error)
    }
  }

  /**
   * Hide the loading screen with animation
   */
  hideLoadingScreen() {
    setTimeout(() => {
      const loading = this.domUtils.getElementById('loading')
      
      if (loading) {
        loading.classList.add('animated', 'fadeOut')
        setTimeout(() => {
          loading.classList.remove('animated', 'fadeOut')
          loading.style.display = 'none'
        }, 800)
      }

      this.logger.performance('Loading screen hide', this.loadingStartTime)
    }, 1650)
  }

  /**
   * Handle scroll events for responsive header behavior
   */
  handleScroll() {
    try {
      if (this.windowWidth >= 1000) {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        const header = this.domUtils.getElementById('header')
        const navigation = this.domUtils.getElementById('navigation')

        if (scrollTop > 80) {
          this.setHeaderScrolled(header, navigation)
        } else {
          this.setHeaderDefault(header, navigation)
        }
      }
    } catch (error) {
      this.logger.error('Error handling scroll', error)
    }
  }

  /**
   * Set header styles when scrolled
   * @param {HTMLElement} header - The header element
   * @param {HTMLElement} navigation - The navigation element
   */
  setHeaderScrolled(header, navigation) {
    if (!header) return

    const scrolledStyles = {
      background: '#fff',
      color: '#000',
      boxShadow: '0px 0px 20px rgba(0,0,0,0.09)',
      padding: '4vh 4vw'
    }

    this.domUtils.setStyles(header, scrolledStyles)

    // Setup navigation hover effects
    if (navigation) {
      const links = navigation.querySelectorAll('a')
      links.forEach(link => {
        this.domUtils.addEventListener(link, 'mouseenter', () => {
          link.style.borderBottom = '2px solid rgb(255, 44, 90)'
        })
        this.domUtils.addEventListener(link, 'mouseleave', () => {
          link.style.borderBottom = '2px solid transparent'
        })
      })
    }
  }

  /**
   * Set header styles to default state
   * @param {HTMLElement} header - The header element
   * @param {HTMLElement} navigation - The navigation element
   */
  setHeaderDefault(header, navigation) {
    if (!header) return

    const defaultStyles = {
      background: 'transparent',
      color: '#fff',
      boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      padding: '6vh 4vw'
    }

    this.domUtils.setStyles(header, defaultStyles)

    // Setup navigation hover effects
    if (navigation) {
      const links = navigation.querySelectorAll('a')
      links.forEach(link => {
        this.domUtils.addEventListener(link, 'mouseenter', () => {
          link.style.borderBottom = '2px solid #fff'
        })
        this.domUtils.addEventListener(link, 'mouseleave', () => {
          link.style.borderBottom = '2px solid transparent'
        })
      })
    }
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    this.windowWidth = window.innerWidth
    this.logger.debug(`Window resized to: ${this.windowWidth}px`)
  }

  /**
   * Magnify an image
   * @param {string} imageLink - The image URL
   */
  magnify(imageLink) {
    try {
      const imgHere = this.domUtils.getElementById('img_here')
      const magnify = this.domUtils.getElementById('magnify')

      if (imgHere && magnify) {
        imgHere.style.background = `url('${imageLink}') center center`
        magnify.style.display = 'flex'
        magnify.classList.add('animated', 'fadeIn')
        
        setTimeout(() => {
          magnify.classList.remove('animated', 'fadeIn')
        }, 800)

        this.logger.debug(`Magnified image: ${imageLink}`)
      }
    } catch (error) {
      this.logger.error('Error magnifying image', error)
    }
  }

  /**
   * Close the magnified image
   */
  closeMagnify() {
    try {
      const imgHere = this.domUtils.getElementById('img_here')
      const magnify = this.domUtils.getElementById('magnify')

      if (imgHere && magnify) {
        magnify.classList.add('animated', 'fadeOut')
        
        setTimeout(() => {
          magnify.style.display = 'none'
          magnify.classList.remove('animated', 'fadeOut')
          imgHere.style.background = `url('') center center`
        }, 800)

        this.logger.debug('Closed magnified image')
      }
    } catch (error) {
      this.logger.error('Error closing magnified image', error)
    }
  }

  /**
   * Cleanup method for removing event listeners
   */
  destroy() {
    try {
      // Remove event listeners
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.handleResize)
      
      this.logger.info('Lenny application destroyed')
    } catch (error) {
      this.logger.error('Error during Lenny cleanup', error)
    }
  }
}

export default LennyApp