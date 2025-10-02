import performanceMonitor from '../src/utils/performance.js'

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Timing functionality', () => {
    test('should start timing', () => {
      const startTime = performanceMonitor.startTiming('test-operation')
      expect(startTime).toBeGreaterThan(0)
      expect(typeof startTime).toBe('number')
    })

    test('should end timing and return duration', () => {
      performanceMonitor.startTiming('test-operation')
      const duration = performanceMonitor.endTiming('test-operation')
      
      expect(duration).toBeGreaterThan(0)
      expect(typeof duration).toBe('number')
    })

    test('should handle timing for non-existent operation', () => {
      const duration = performanceMonitor.endTiming('non-existent')
      expect(duration).toBe(0)
    })
  })

  describe('Performance summary', () => {
    test('should return performance summary', () => {
      performanceMonitor.startTiming('op1')
      performanceMonitor.endTiming('op1')
      
      performanceMonitor.startTiming('op2')
      performanceMonitor.endTiming('op2')
      
      const summary = performanceMonitor.getSummary()
      
      expect(summary).toHaveProperty('op1')
      expect(summary).toHaveProperty('op2')
      expect(typeof summary.op1).toBe('number')
      expect(typeof summary.op2).toBe('number')
    })
  })

  describe('Interaction tracking', () => {
    test('should track user interactions', () => {
      const mockGtag = jest.fn()
      window.gtag = mockGtag
      
      performanceMonitor.trackInteraction('test-action', { value: 123 })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'test-action', { value: 123 })
    })

    test('should handle tracking without gtag', () => {
      delete window.gtag
      
      expect(() => {
        performanceMonitor.trackInteraction('test-action')
      }).not.toThrow()
    })
  })

  describe('Memory monitoring', () => {
    test('should handle memory monitoring when available', () => {
      // Mock performance.memory
      Object.defineProperty(performance, 'memory', {
        value: {
          usedJSHeapSize: 1048576, // 1MB
          totalJSHeapSize: 2097152  // 2MB
        },
        writable: true
      })
      
      expect(() => {
        performanceMonitor.monitorMemory()
      }).not.toThrow()
    })

    test('should handle memory monitoring when not available', () => {
      delete performance.memory
      
      expect(() => {
        performanceMonitor.monitorMemory()
      }).not.toThrow()
    })
  })
})