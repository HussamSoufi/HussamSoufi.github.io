// Jest setup file
import 'jsdom-global/register'

// Mock jQuery for tests
global.$ = require('jquery')
global.jQuery = global.$

// Mock particlesJS
global.particlesJS = jest.fn()

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

// Setup DOM environment
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