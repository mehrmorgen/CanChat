# Project Structure

## File Organization

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
│   ├── steering/                # AI assistant guidance documents
│   │   ├── product.md           # Product overview and features
│   │   ├── tech.md              # Technology stack and commands
│   │   └── structure.md         # This file - project organization
│   └── specs/                   # Feature specifications
│       └── bun-migration-refactor/ # Current feature spec
│           ├── requirements.md   # Detailed requirements
│           ├── design.md        # Technical design document
│           └── tasks.md         # Implementation task breakdown
└── .vscode/                     # VS Code configuration
```

## Modular ESM Architecture

The application is organized into separate modules with clear separation of concerns:

### HTML Structure (`chat.html`)
- Semantic markup with proper accessibility attributes
- Required DOM elements with specific IDs for JavaScript interaction
- Minimal, clean interface focused on chat functionality
- Module script reference: `<script type="module" src="/src/chat.js">`
- CSS link: `<link rel="stylesheet" href="/src/styles.css">`

### CSS Organization (`src/styles.css`)
- Responsive design with mobile-first approach
- Clean, modern styling with consistent color scheme
- Proper visual hierarchy and user feedback states
- Extracted from inline styles for better maintainability

### JavaScript Organization (ESM Modules)

**Main Application (`src/chat.js`):**
```javascript
// 1. ESM imports from external dependencies and internal modules
// 2. Application state management
// 3. PeerJS initialization (async/await patterns)
// 4. Connection Management (Promise-based)
// 5. Message Handling (modern event handling)
// 6. Event Listeners Setup (addEventListener with options)
// 7. Application Initialization (DOMContentLoaded)
```

**Utilities (`src/utils.js`):**
```javascript
// 1. Pure utility functions (formatting, validation)
// 2. Test framework setup and execution
// 3. DOM helper functions
// 4. ESM exports for all functions
```

## Code Conventions

### Naming Conventions
- **DOM Elements**: Use kebab-case IDs (`my-id`, `peer-id-input`)
- **JavaScript Variables**: Use camelCase (`myId`, `peerIdInput`)
- **Functions**: Use descriptive camelCase (`handleConnectClick`, `addSystemMessage`)
- **Constants**: Use UPPER_SNAKE_CASE for configuration values

### Function Organization
- **Helper Functions**: Pure functions for formatting and utilities
- **Event Handlers**: Functions that respond to user or system events
- **State Management**: Functions that update application state
- **UI Updates**: Functions that modify DOM elements

### Testing Structure (`tests/` directory)
- **Test Modules**: Organized by functionality using ESM imports
- **Unit Tests**: `tests/utils.test.js` for utility functions
- **Integration Tests**: `tests/chat.test.js` for chat functionality
- **DOM Tests**: `tests/dom.test.js` for DOM manipulation
- **Test Types**: Unit tests for individual functions, integration tests for workflows
- **Coverage**: 100% code coverage requirement for all production code

## Development Workflow

### TDD Process with Bun
1. Write failing tests for new functionality using ESM imports
2. Implement minimal code to make tests pass
3. Run `bun test --watch` for continuous testing
4. Refactor while maintaining test coverage
5. Commit with descriptive messages

### Module Development
- **ESM-First**: All modules use native ESM syntax with import/export
- **Separation of Concerns**: Each module has a single, clear responsibility
- **No Transpilation**: Direct browser execution of modern JavaScript
- **Fast Development**: Bun's sub-100ms startup for rapid iteration

### File Management
- Modular architecture with separated CSS, JavaScript, and HTML
- Bun configuration for development server and testing
- No external build dependencies beyond Bun runtime
- Version control tracks incremental feature development
- Specifications document requirements and design decisions