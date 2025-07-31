# Project Guidelines for Junie

## Project Overview

WebRTC PeerJS Chat is a minimal peer-to-peer text chat application that enables direct browser-to-browser communication using WebRTC technology. The application allows two users to connect using unique peer IDs and exchange messages in real-time without requiring a central server for message relay.

### Key Features

- **Direct P2P Communication**: Messages flow directly between browsers after connection establishment
- **No Server Dependencies**: Uses PeerJS cloud signaling and Google STUN servers for connection setup
- **Modular ESM Architecture**: Clean separation of concerns with native ES modules
- **Fast Development Environment**: Bun-powered development server with sub-100ms startup
- **Real-time Messaging**: Instant message delivery between connected peers
- **Simple Interface**: Clean, minimal UI focused on core chat functionality

### Target Use Cases

- Quick peer-to-peer communication without account creation
- Educational demonstrations of WebRTC technology
- Temporary chat sessions between known parties
- Development and testing of WebRTC concepts

## Project Structure

### File Organization

```
.
├── chat.html                    # HTML entry point (no inline JS/CSS)
├── bunfig.toml                  # Bun configuration and scripts
├── package.json                 # Package management and script definitions
├── src/                         # Source code modules
│   ├── chat.js                  # Main application module (ESM)
│   ├── utils.js                 # Helper functions and utilities (ESM)
│   └── styles.css               # Extracted CSS styles
├── tests/                       # Test modules
│   ├── utils.test.js            # Unit tests for utilities (ESM)
│   ├── chat.test.js             # Integration tests for chat functionality
│   └── dom.test.js              # DOM manipulation tests
├── .git/                        # Git version control
├── .kiro/                       # Kiro IDE configuration
└── .vscode/                     # VS Code configuration
```

### Modular ESM Architecture

The application is organized into separate modules with clear separation of concerns:

- **HTML Structure (`chat.html`)**: Semantic markup with proper accessibility attributes
- **CSS Organization (`src/styles.css`)**: Responsive design with mobile-first approach
- **JavaScript Organization (ESM Modules)**:
  - **Main Application (`src/chat.js`)**: Application state management, PeerJS initialization, connection management, message handling, event listeners setup
  - **Utilities (`src/utils.js`)**: Pure utility functions, DOM helper functions

## Technology Stack

### Core Technologies

- **HTML5**: Modern semantic markup with modular CSS and JavaScript
- **CSS3**: Modern CSS features (Grid, Flexbox, Custom Properties) in separate stylesheet
- **JavaScript (Latest)**: Cutting-edge vanilla JavaScript using ESM modules and the most recent features available in current Firefox, Safari, and Chrome
- **WebRTC**: Direct peer-to-peer communication via browser APIs
- **PeerJS**: WebRTC abstraction library for simplified connection management
- **Bun v1.x**: Fast JavaScript runtime for development server and testing

### External Dependencies

- **PeerJS Library**: `https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js`
- **Bun Test Runner**: Native test framework with ESM support
- **PeerJS Cloud Server**: Default signaling server for peer discovery
- **Google STUN Server**: `stun:stun.l.google.com:19302` for NAT traversal

### Browser Requirements

- **Latest browsers only**: Current versions of Chrome, Firefox, and Safari (latest stable releases)
- **Cutting-edge features**: Use the newest JavaScript syntax, WebRTC APIs, and browser capabilities available
- **No compatibility layers**: Zero polyfills, transpilation, or legacy browser support
- **Modern APIs only**: Leverage the most recent DOM, Web, and JavaScript APIs
- **HTTPS required for production**: WebRTC getUserMedia and connection security requirement
- **Mobile-first responsive**: Latest mobile browser versions with newest features

## Development Methodology

### Test-Driven Development (TDD)

- All features developed with tests first
- 100% test coverage requirement for all production code
- ESM module architecture with native ES modules
- Modern browser testing with Bun's native test runner
- Modern-first development using the latest JavaScript features

### Development Environment Setup

This application uses cutting-edge JavaScript features (ES2020+) and requires proper IDE configuration for optimal development experience:

1. **Modern Browser**: Use Chrome 88+, Firefox 85+, or Safari 14+
2. **IDE Configuration**: Configure your IDE for ES2020+ JavaScript support
3. **HTTPS Server**: Use HTTPS for local development (WebRTC requirement)

For comprehensive IDE setup instructions, see `IDE_CONFIGURATION.md` which covers:

- **VS Code**: Settings, extensions, and debugging configuration
- **WebStorm/IntelliJ**: JavaScript language version and code style setup
- **Sublime Text**: Package installation and syntax configuration
- **Common Issues**: Solutions for syntax errors and compatibility problems

### Common Commands

```bash
# Start development server (fast startup <100ms)
bun run dev

# Install dependencies
bun install

# Run tests in watch mode
bun test --watch

# Run tests once
bun test

# Start production server
bun run start
```

### Code Conventions

#### Naming Conventions
- **DOM Elements**: Use kebab-case IDs (`my-id`, `peer-id-input`)
- **JavaScript Variables**: Use camelCase (`myId`, `peerIdInput`)
- **Functions**: Use descriptive camelCase (`handleConnectClick`, `addSystemMessage`)
- **Constants**: Use UPPER_SNAKE_CASE for configuration values

#### Function Organization
- **Helper Functions**: Pure functions for formatting and utilities
- **Event Handlers**: Functions that respond to user or system events
- **State Management**: Functions that update application state
- **UI Updates**: Functions that modify DOM elements

#### Modern JavaScript Features Used

This application leverages cutting-edge JavaScript features:

- **Optional Chaining** (`?.`): Safe property access
- **Nullish Coalescing** (`??`): Default value assignment
- **BigInt**: Large integer support
- **Private Class Fields** (`#private`): True encapsulation
- **Promise.allSettled**: Advanced promise handling
- **Modern Array Methods**: `flatMap`, `structuredClone`
- **Top-level Await**: Module-level async operations

## Testing Requirements

### Test Suite Structure

1. **Core Unit Tests (`tests/utils.test.js`)**
   - Comprehensive testing of all utility functions
   - Edge case handling and error scenarios

2. **DOM Integration Tests (`tests/dom.test.js`)**
   - DOM element retrieval and manipulation
   - Event listener management
   - Error recovery scenarios

3. **Chat Application Tests (`tests/chat.test.js`)**
   - Application initialization and state management
   - Connection management workflows
   - Message handling and UI updates

4. **Browser Detection Tests (`tests/browser-detection.test.js`)**
   - Modern browser feature detection
   - Legacy browser rejection
   - Mobile browser identification

5. **PeerJS Integration Tests (`tests/peerjs-integration.test.js`)**
   - Peer connection establishment
   - Message sending and receiving
   - Error handling and disconnection

6. **Event Handler Tests (`tests/event-handlers.test.js`)**
   - User interaction handling
   - Keyboard event processing
   - Connection state management

7. **Chat Integration Tests (`tests/chat-integration.test.js`)**
   - End-to-end workflow testing
   - Browser environment simulation
   - Complete user interaction flows

8. **Comprehensive Coverage Tests (`tests/comprehensive-coverage.test.js`)**
   - Edge case testing for all utility functions
   - Error boundary testing
   - Async functionality testing

### Running Tests

- Tests run with Bun's native test runner
- ESM import/export syntax for test modules
- Watch mode for continuous testing during development
- Fast test execution with native runtime

### Manual Testing

For manual testing, follow the instructions in `manual_test_guide.md`, which covers:

1. **Peer-to-Peer Connection Testing**
   - Open two browser instances
   - Generate peer IDs
   - Establish connection between browsers

2. **Message Exchange Testing**
   - Send messages between connected browsers
   - Verify real-time delivery and proper formatting
   - Test message history and auto-scroll functionality

3. **WebRTC Functionality Verification**
   - Verify WebRTC connection establishment
   - Check for any JavaScript errors
   - Test connection resilience

4. **Responsive Design Testing**
   - Test application at various screen sizes
   - Verify mobile device compatibility
   - Confirm touch interaction functionality

5. **Error Handling and Edge Cases**
   - Test invalid peer ID handling
   - Verify connection failure handling
   - Check cross-browser compatibility

### Test Quality Requirements

- All tests must be deterministic and repeatable
- Proper setup/teardown in each test suite
- Mock objects for external dependencies
- Error scenarios properly tested
- 100% function coverage for utility modules
- Comprehensive edge case testing
- Error boundary validation
- Performance requirements met (all tests complete in under 1 second)

## Deployment Process

- Static file serving with no build step required
- ESM modules served directly to browsers
- Works with CDN deployment
- GitHub Pages compatible
- HTTPS enforcement (required for WebRTC)

### GitHub Pages Configuration

- **Repository**: `mehrmorgen/CanChat`
- **Source Branch**: `main` (root directory)
- **Deployment URL**: [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)
- **HTTPS Enforced**: Yes (automatic)
- **Custom Domain**: Not configured (using github.io subdomain)

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Ensure both devices are using HTTPS (GitHub Pages URL)
   - Verify peer IDs are entered correctly
   - Some corporate firewalls may block WebRTC

2. **WebRTC Not Working**
   - Use the GitHub Pages HTTPS URL, not local file:// protocol
   - Ensure you're using a modern browser with WebRTC support

3. **Can't Generate Peer ID**
   - Check browser console for errors
   - Ensure PeerJS cloud server is accessible

4. **Performance Issues**
   - Slow connection establishment may be due to NAT traversal
   - Wait up to 30 seconds for connection establishment
   - If messages not appearing, verify connection status shows "Connected!"

### IDE-Related Issues

1. **Syntax Errors in IDE**
   - Update JavaScript language version to ES2020+
   - Install modern JavaScript extensions
   - Configure parser settings for latest features

2. **WebRTC Not Working Locally**
   - Use HTTPS (required for WebRTC)
   - Run `python test_https_server.py` for local HTTPS
   - Avoid `file://` protocol for testing

3. **Modern Features Not Recognized**
   - Check browser version (must be modern)
   - Verify IDE configuration for ES2020+
   - See `IDE_CONFIGURATION.md` for detailed setup