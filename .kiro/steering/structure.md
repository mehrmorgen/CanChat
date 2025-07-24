# Project Structure

## File Organization

```
.
├── chat.html                    # Main application file (single-file architecture)
├── .git/                       # Git version control
├── .kiro/                      # Kiro IDE configuration
│   ├── steering/               # AI assistant guidance documents
│   │   ├── product.md          # Product overview and features
│   │   ├── tech.md             # Technology stack and commands
│   │   └── structure.md        # This file - project organization
│   └── specs/                  # Feature specifications
│       └── webrtc-peerjs-chat/ # Current feature spec
│           ├── requirements.md  # Detailed requirements
│           ├── design.md       # Technical design document
│           └── tasks.md        # Implementation task breakdown
└── .vscode/                    # VS Code configuration
```

## Single File Architecture

The entire application is contained within `chat.html` with the following internal structure:

### HTML Structure
- Semantic markup with proper accessibility attributes
- Required DOM elements with specific IDs for JavaScript interaction
- Minimal, clean interface focused on chat functionality

### CSS Organization (Inline)
- Responsive design with mobile-first approach
- Clean, modern styling with consistent color scheme
- Proper visual hierarchy and user feedback states

### JavaScript Organization (Single Script Block)
```javascript
// 1. Testing Framework Setup
// 2. Test Suites (Unit & Integration)
// 3. Application Variables & State
// 4. Helper Functions
// 5. PeerJS Initialization
// 6. Connection Management
// 7. Message Handling
// 8. Event Listeners Setup
// 9. Application Initialization
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

### Testing Structure
- **Test Suites**: Organized by functionality (DOM, PeerJS, Connections, Messages)
- **Test Types**: Unit tests for individual functions, integration tests for workflows
- **Coverage**: 100% code coverage requirement for all production code

## Development Workflow

### TDD Process
1. Write failing tests for new functionality
2. Implement minimal code to make tests pass
3. Refactor while maintaining test coverage
4. Commit with descriptive messages

### File Management
- Single file contains all application logic
- No external build dependencies
- Version control tracks incremental feature development
- Specifications document requirements and design decisions