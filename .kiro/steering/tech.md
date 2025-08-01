# Technology Stack

## Core Technologies

- **HTML5**: Modern semantic markup with modular CSS and JavaScript
- **CSS3**: Modern CSS features (Grid, Flexbox, Custom Properties) in separate stylesheet
- **JavaScript (Latest)**: Cutting-edge vanilla JavaScript using ESM modules and the most recent features available in current Firefox, Safari, and Chrome
- **WebRTC**: Direct peer-to-peer communication via browser APIs
- **PeerJS**: WebRTC abstraction library for simplified connection management
- **Bun v1.x**: Fast JavaScript runtime for development server and testing

## External Dependencies

- **PeerJS Library**: `https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js`
- **Bun Test Runner**: Native test framework with ESM support
- **PeerJS Cloud Server**: Default signaling server for peer discovery
- **Google STUN Server**: `stun:stun.l.google.com:19302` for NAT traversal

## Development Methodology

- **Test-Driven Development (TDD)**: All features developed with tests first
- **100% Test Coverage**: Every function and code path must be tested
- **ESM Module Architecture**: Native ES modules with import/export syntax
- **Modern Browser Testing**: Tests run with Bun's native test runner
- **Modern-First Development**: Use the latest JavaScript features and browser APIs without any backwards compatibility considerations

## Common Commands

### Development with Bun

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

### Git Operations

```bash
# Use non-interactive commands only
git log --oneline                    # View commit history
git show --name-only <commit>        # Show files in commit
git reset --soft HEAD~n             # Reset commits without losing changes
git add <files>                      # Stage specific files
git commit -m "message"              # Commit with message
```

**Important**: Avoid interactive git commands like `git rebase -i`, `git add -p`, or any command that opens an editor or requires user interaction during execution.

#### Commit Requirements

**MANDATORY**: After completing each task from a spec, you MUST commit the changes with a structured commit message that includes:

1. **Task Description**: Brief summary of what was implemented
2. **Requirements Fulfilled**: Complete copy of the requirement(s) addressed, including:
   - User story in full
   - All acceptance criteria that were satisfied
   - Requirement numbers/identifiers

**Commit Message Format:**
```
<Task Summary>

Requirements Fulfilled:

Requirement X.Y: <Full User Story>
As a [role], I want [feature], so that [benefit]

Acceptance Criteria:
1. WHEN [event] THEN [system] SHALL [response]
2. IF [precondition] THEN [system] SHALL [response]
[... all relevant acceptance criteria ...]

Files Modified:
- path/to/file1.js
- path/to/file2.html
- tests/feature.test.js
```

**Example:**
```bash
git add src/chat.js tests/chat.test.js
git commit -m "Implement peer connection establishment

Requirements Fulfilled:

Requirement 1.1: Peer Connection Management
As a user, I want to establish a connection with another peer using their ID, so that I can start a chat session.

Acceptance Criteria:
1. WHEN a user enters a valid peer ID THEN the system SHALL attempt to establish a WebRTC connection
2. WHEN the connection is successful THEN the system SHALL display a connection status message
3. IF the peer ID is invalid or unreachable THEN the system SHALL display an appropriate error message

Files Modified:
- src/chat.js
- tests/chat.test.js"
```

This approach establishes the git history as a comprehensive source of truth, linking each code change directly to the business requirements it fulfills.

### Testing

- Tests run with Bun's native test runner
- ESM import/export syntax for test modules
- Watch mode for continuous testing during development
- Fast test execution with native runtime

### Deployment

- Static file serving with no build step required
- ESM modules served directly to browsers
- Works with CDN deployment
- GitHub Pages compatible

## Browser Requirements

- **Latest browsers only**: Current versions of Chrome, Firefox, and Safari (latest stable releases)
- **Cutting-edge features**: Use the newest JavaScript syntax, WebRTC APIs, and browser capabilities available
- **No compatibility layers**: Zero polyfills, transpilation, or legacy browser support
- **Modern APIs only**: Leverage the most recent DOM, Web, and JavaScript APIs
- **HTTPS required for production**: WebRTC getUserMedia and connection security requirement
- **Mobile-first responsive**: Latest mobile browser versions with newest features
