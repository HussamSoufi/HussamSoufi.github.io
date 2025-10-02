import logger from '../src/utils/logger.js'

describe('Logger', () => {
  let originalConsole

  beforeEach(() => {
    // Store original console methods
    originalConsole = {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    }

    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original console methods
    Object.assign(console, originalConsole)
  })

  describe('Logging levels', () => {
    test('should log error messages', () => {
      logger.error('Test error message')
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: Test error message')
      )
    })

    test('should log warning messages', () => {
      logger.warn('Test warning message')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARN: Test warning message')
      )
    })

    test('should log info messages', () => {
      logger.info('Test info message')
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('INFO: Test info message')
      )
    })

    test('should log debug messages', () => {
      logger.debug('Test debug message')
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG: Test debug message')
      )
    })

    test('should include timestamps in log messages', () => {
      logger.info('Test message')
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
      )
    })
  })

  describe('Log level filtering', () => {
    test('should respect ERROR level filtering', () => {
      logger.setLevel('ERROR')
      
      logger.error('Error message')
      logger.warn('Warning message')
      logger.info('Info message')
      logger.debug('Debug message')

      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.warn).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.debug).not.toHaveBeenCalled()
    })

    test('should respect WARN level filtering', () => {
      logger.setLevel('WARN')
      
      logger.error('Error message')
      logger.warn('Warning message')
      logger.info('Info message')
      logger.debug('Debug message')

      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.info).not.toHaveBeenCalled()
      expect(console.debug).not.toHaveBeenCalled()
    })

    test('should respect INFO level filtering', () => {
      logger.setLevel('INFO')
      
      logger.error('Error message')
      logger.warn('Warning message')
      logger.info('Info message')
      logger.debug('Debug message')

      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.info).toHaveBeenCalledTimes(1)
      expect(console.debug).not.toHaveBeenCalled()
    })

    test('should respect DEBUG level filtering', () => {
      logger.setLevel('DEBUG')
      
      logger.error('Error message')
      logger.warn('Warning message')
      logger.info('Info message')
      logger.debug('Debug message')

      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.info).toHaveBeenCalledTimes(1)
      expect(console.debug).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error handling', () => {
    test('should handle error objects', () => {
      const testError = new Error('Test error')
      logger.error('Error occurred', testError)
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: Error occurred')
      )
      expect(console.error).toHaveBeenCalledWith(testError)
    })
  })

  describe('Performance logging', () => {
    test('should log performance metrics', () => {
      const startTime = performance.now() - 100 // Simulate 100ms elapsed
      logger.performance('Test operation', startTime)
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Performance: Test operation took')
      )
    })
  })
})