import App from '../src/components/App.js'

// Mock dependencies
jest.mock('../src/utils/logger.js', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  performance: jest.fn()
}))

jest.mock('../src/utils/domUtils.js', () => ({
  getElementById: jest.fn(),
  showElement: jest.fn(),
  hideElement: jest.fn(),
  addEventListener: jest.fn(),
  debounce: jest.fn((fn) => fn)
}))

// Mock particlesJS
global.particlesJS = jest.fn()

describe('App', () => {
  let app
  let mockDomUtils
  let mockLogger

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="loading"></div>
      <div id="particles-js"></div>
      <div id="box"></div>
      <div id="about_container"></div>
      <div id="work_container"></div>
      <div id="contact_container"></div>
      <div id="middle"></div>
      <div id="about"></div>
      <div id="work"></div>
      <div id="contact"></div>
    `

    // Clear all mocks
    jest.clearAllMocks()

    // Get mock references
    mockDomUtils = require('../src/utils/domUtils.js')
    mockLogger = require('../src/utils/logger.js')

    // Setup default mock implementations
    mockDomUtils.getElementById.mockImplementation((id) => document.getElementById(id))
    mockDomUtils.debounce.mockImplementation((fn) => fn)

    app = new App()
  })

  afterEach(() => {
    if (app) {
      app.destroy()
    }
  })

  describe('Initialization', () => {
    test('should initialize successfully', async () => {
      await app.init()
      
      expect(app.isInitialized).toBe(true)
      expect(mockLogger.info).toHaveBeenCalledWith('Initializing application...')
      expect(mockLogger.info).toHaveBeenCalledWith('Application initialized successfully')
    })

    test('should setup event listeners during initialization', async () => {
      await app.init()
      
      expect(mockDomUtils.addEventListener).toHaveBeenCalled()
    })

    test('should initialize particles during initialization', async () => {
      await app.init()
      
      expect(global.particlesJS).toHaveBeenCalledWith('particles-js', expect.any(Object))
    })

    test('should handle initialization errors', async () => {
      mockDomUtils.getElementById.mockImplementation(() => {
        throw new Error('DOM error')
      })

      await expect(app.init()).rejects.toThrow('DOM error')
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to initialize application', expect.any(Error))
    })
  })

  describe('Navigation methods', () => {
    beforeEach(async () => {
      await app.init()
    })

    test('should show about section', () => {
      app.showAbout()
      
      expect(mockLogger.info).toHaveBeenCalledWith('Showing about section')
      expect(mockDomUtils.showElement).toHaveBeenCalledWith('about_container', 'slideInLeft')
    })

    test('should close about section', () => {
      app.closeAbout()
      
      expect(mockLogger.info).toHaveBeenCalledWith('Closing about section')
      expect(mockDomUtils.hideElement).toHaveBeenCalledWith('about_container', 'slideOutLeft')
    })

    test('should show work section', () => {
      app.showWork()
      
      expect(mockLogger.info).toHaveBeenCalledWith('Showing work section')
      expect(mockDomUtils.showElement).toHaveBeenCalledWith('work_container', 'slideInRight')
    })

    test('should close work section', () => {
      app.closeWork()
      
      expect(mockLogger.info).toHaveBeenCalledWith('Closing work section')
      expect(mockDomUtils.hideElement).toHaveBeenCalledWith('work_container', 'slideOutRight')
    })

    test('should show contact section', () => {
      app.showContact()
      
      expect(mockLogger.info).toHaveBeenCalledWith('Showing contact section')
      expect(mockDomUtils.showElement).toHaveBeenCalledWith('contact_container', 'slideInUp')
    })

    test('should close contact section', () => {
      app.closeContact()
      
      expect(mockLogger.info).toHaveBeenCalledWith('Closing contact section')
      expect(mockDomUtils.hideElement).toHaveBeenCalledWith('contact_container', 'slideOutDown')
    })
  })

  describe('Event handling', () => {
    beforeEach(async () => {
      await app.init()
    })

    test('should handle scroll events', () => {
      app.handleScroll()
      
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('Scroll position:'))
    })

    test('should handle resize events', () => {
      app.handleResize()
      
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('Window resized to:'))
    })
  })

  describe('Particles configuration', () => {
    test('should return valid particles configuration', () => {
      const config = app.getParticlesConfig()
      
      expect(config).toHaveProperty('particles')
      expect(config).toHaveProperty('interactivity')
      expect(config.particles).toHaveProperty('number')
      expect(config.particles).toHaveProperty('color')
      expect(config.particles).toHaveProperty('shape')
    })
  })

  describe('Cleanup', () => {
    test('should cleanup event listeners on destroy', async () => {
      await app.init()
      
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
      app.destroy()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(mockLogger.info).toHaveBeenCalledWith('Application destroyed')
    })
  })

  describe('Loading screen', () => {
    test('should hide loading screen after delay', (done) => {
      const loadingElement = document.getElementById('loading')
      const boxElement = document.getElementById('box')
      
      app.hideLoadingScreen()
      
      // Initially, elements should be visible
      expect(loadingElement.style.display).toBe('')
      expect(boxElement.style.display).toBe('')
      
      // After delay, loading should be hidden
      setTimeout(() => {
        expect(loadingElement.style.display).toBe('none')
        expect(boxElement.style.display).toBe('none')
        done()
      }, 1600)
    })
  })
})