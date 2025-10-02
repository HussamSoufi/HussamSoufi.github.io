import logger from '../utils/logger.js'
import domUtils from '../utils/domUtils.js'

/**
 * Main application class for managing the portfolio website
 */
class App {
  constructor() {
    this.logger = logger
    this.domUtils = domUtils
    this.isInitialized = false
    this.loadingStartTime = performance.now()
    
    // Bind methods to preserve context
    this.showAbout = this.showAbout.bind(this)
    this.closeAbout = this.closeAbout.bind(this)
    this.showWork = this.showWork.bind(this)
    this.closeWork = this.closeWork.bind(this)
    this.showContact = this.showContact.bind(this)
    this.closeContact = this.closeContact.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      this.logger.info('Initializing application...')
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve)
        })
      }

      this.setupEventListeners()
      this.initializeParticles()
      this.hideLoadingScreen()
      
      this.isInitialized = true
      this.logger.info('Application initialized successfully')
      
    } catch (error) {
      this.logger.error('Failed to initialize application', error)
      throw error
    }
  }

  /**
   * Setup event listeners for the application
   */
  setupEventListeners() {
    try {
      // Navigation buttons
      const aboutBtn = this.domUtils.getElementById('about')
      const workBtn = this.domUtils.getElementById('work')
      const contactBtn = this.domUtils.getElementById('contact')

      if (aboutBtn) {
        this.domUtils.addEventListener(aboutBtn, 'click', this.showAbout)
      }
      if (workBtn) {
        this.domUtils.addEventListener(workBtn, 'click', this.showWork)
      }
      if (contactBtn) {
        this.domUtils.addEventListener(contactBtn, 'click', this.showContact)
      }

      // Scroll handling with debouncing for performance
      const debouncedScrollHandler = this.domUtils.debounce(this.handleScroll, 16)
      window.addEventListener('scroll', debouncedScrollHandler, { passive: true })

      // Resize handling with debouncing
      const debouncedResizeHandler = this.domUtils.debounce(this.handleResize, 250)
      window.addEventListener('resize', debouncedResizeHandler)

      this.logger.debug('Event listeners setup completed')
    } catch (error) {
      this.logger.error('Error setting up event listeners', error)
    }
  }

  /**
   * Initialize particles.js with error handling
   */
  initializeParticles() {
    try {
      if (typeof particlesJS === 'function') {
        particlesJS('particles-js', this.getParticlesConfig())
        this.logger.debug('Particles initialized')
      } else {
        this.logger.warn('particlesJS not available')
      }
    } catch (error) {
      this.logger.error('Error initializing particles', error)
    }
  }

  /**
   * Get particles configuration
   * @returns {Object} Particles configuration object
   */
  getParticlesConfig() {
    return {
      particles: {
        number: {
          value: 160,
          density: {
            enable: true,
            value_area: 4000
          }
        },
        color: {
          value: '#ff3232'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#ff3232'
          }
        },
        opacity: {
          value: 1,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0,
            sync: false
          }
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 2,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: false,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: false,
            mode: 'bubble'
          },
          onclick: {
            enable: false,
            mode: 'repulse'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3
          },
          repulse: {
            distance: 400,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    }
  }

  /**
   * Hide the loading screen with animation
   */
  hideLoadingScreen() {
    setTimeout(() => {
      const loading = this.domUtils.getElementById('loading')
      const box = this.domUtils.getElementById('box')
      
      if (loading) {
        loading.classList.add('animated', 'fadeOut')
        setTimeout(() => {
          loading.classList.remove('animated', 'fadeOut')
          loading.style.display = 'none'
        }, 1000)
      }

      if (box) {
        box.style.display = 'none'
      }

      // Remove fade-in classes from navigation elements
      const navElements = ['about', 'contact', 'work']
      navElements.forEach(id => {
        const element = this.domUtils.getElementById(id)
        if (element) {
          element.classList.remove('animated', 'fadeIn')
        }
      })

      this.logger.performance('Loading screen hide', this.loadingStartTime)
    }, 1500)
  }

  /**
   * Show about section
   */
  showAbout() {
    this.logger.info('Showing about section')
    this.domUtils.showElement('about_container', 'slideInLeft')
  }

  /**
   * Close about section
   */
  closeAbout() {
    this.logger.info('Closing about section')
    this.domUtils.hideElement('about_container', 'slideOutLeft')
  }

  /**
   * Show work section
   */
  showWork() {
    this.logger.info('Showing work section')
    this.domUtils.showElement('work_container', 'slideInRight')
  }

  /**
   * Close work section
   */
  closeWork() {
    this.logger.info('Closing work section')
    this.domUtils.hideElement('work_container', 'slideOutRight')
  }

  /**
   * Show contact section
   */
  showContact() {
    this.logger.info('Showing contact section')
    this.domUtils.showElement('contact_container', 'slideInUp')
  }

  /**
   * Close contact section
   */
  closeContact() {
    this.logger.info('Closing contact section')
    this.domUtils.hideElement('contact_container', 'slideOutDown')
  }

  /**
   * Handle scroll events for responsive behavior
   */
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    // Add any scroll-based functionality here
    this.logger.debug(`Scroll position: ${scrollTop}px`)
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    const width = window.innerWidth
    this.logger.debug(`Window resized to: ${width}px`)
    
    // Add responsive behavior here
  }

  /**
   * Cleanup method for removing event listeners
   */
  destroy() {
    try {
      // Remove event listeners
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.handleResize)
      
      this.logger.info('Application destroyed')
    } catch (error) {
      this.logger.error('Error during cleanup', error)
    }
  }
}

export default App