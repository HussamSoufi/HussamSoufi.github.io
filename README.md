# Portfolio Website - Refactored & Optimized

A modern, responsive portfolio website built with vanilla JavaScript, featuring a clean architecture, comprehensive testing, and optimized build system.

## 🚀 Features

- **Modern JavaScript Architecture**: ES6+ modules with proper separation of concerns
- **Comprehensive Logging**: Structured logging system for debugging and monitoring
- **Performance Optimized**: Debounced event handlers, lazy loading, and optimized animations
- **Error Handling**: Global error handling with graceful fallbacks
- **Testing**: Complete test suite with Jest and JSDOM
- **Build System**: Enhanced Gulp build with source maps, linting, and optimization
- **Responsive Design**: Mobile-first responsive design with smooth animations

## 📁 Project Structure

```
├── src/                          # Source code
│   ├── components/               # Main application components
│   │   ├── App.js               # Main portfolio app
│   │   └── LennyApp.js          # Lenny portfolio section
│   ├── utils/                   # Utility modules
│   │   ├── logger.js            # Logging utility
│   │   └── domUtils.js          # DOM manipulation utilities
│   └── main.js                  # Application entry point
├── tests/                       # Test files
│   ├── setup.js                # Jest test setup
│   ├── logger.test.js          # Logger tests
│   ├── domUtils.test.js        # DOM utils tests
│   └── App.test.js             # App component tests
├── scss/                        # SASS stylesheets
├── css/                         # Compiled CSS
├── js/                          # Compiled JavaScript
├── vendor/                      # Third-party dependencies
└── lenny/                       # Lenny portfolio section
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start development server:
```bash
npm run dev
```

## 📜 Available Scripts

- `npm start` - Start development server with file watching
- `npm run dev` - Start development server (alias for start)
- `npm run build` - Build production assets
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## 🧪 Testing

The project includes comprehensive tests for all major components:

- **Logger Tests**: Test logging levels, filtering, and error handling
- **DOM Utils Tests**: Test DOM manipulation, animations, and event handling
- **App Tests**: Test main application functionality and initialization

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🏗️ Build System

The enhanced Gulp build system includes:

- **SASS Compilation**: With autoprefixer and source maps
- **JavaScript Bundling**: ES6+ transpilation with Babel
- **Code Optimization**: Minification and dead code elimination
- **Linting**: ESLint integration for code quality
- **Testing**: Jest integration for automated testing
- **Source Maps**: For debugging in development

### Build Tasks

- `gulp build` - Full production build
- `gulp dev` - Development build with watching
- `gulp lint` - Run ESLint
- `gulp test` - Run Jest tests
- `gulp ci` - CI/CD pipeline (build + lint + test)

## 📊 Performance Optimizations

- **Debounced Event Handlers**: Prevents excessive function calls during scroll/resize
- **Lazy Loading**: Images and resources loaded on demand
- **Code Splitting**: Separate bundles for different sections
- **Minification**: Optimized JavaScript and CSS
- **Caching**: Proper cache headers and versioning

## 🔧 Configuration

### Logger Configuration

The logger supports different log levels:
- `ERROR` - Only error messages
- `WARN` - Warning and error messages
- `INFO` - Info, warning, and error messages (default)
- `DEBUG` - All messages including debug

```javascript
import logger from './src/utils/logger.js'

logger.setLevel('DEBUG') // Enable debug logging
logger.info('Application started')
logger.error('Something went wrong', error)
```

### Environment Variables

Set `NODE_ENV=production` to enable production optimizations:
- Disable debug logging
- Enable console removal in builds
- Optimize bundle size

## 🐛 Error Handling

The application includes comprehensive error handling:

- **Global Error Handler**: Catches unhandled JavaScript errors
- **Promise Rejection Handler**: Catches unhandled promise rejections
- **Resource Loading Errors**: Handles failed image/script loading
- **Graceful Fallbacks**: Shows user-friendly error messages

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Start Bootstrap for the original theme
- Particles.js for the particle effects
- Animate.css for animations
- Font Awesome for icons

## 📞 Support

For support or questions, please contact:
- Email: 1sam1tech1@gmail.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Note**: This is a refactored and optimized version of the original portfolio website with modern JavaScript practices, comprehensive testing, and improved performance.