# Technology Stack

## Core Technologies

- **HTML5**: Single-file application structure with semantic markup
- **CSS3**: Inline styling for responsive, clean interface
- **JavaScript (ES6+)**: All application logic in vanilla JavaScript
- **WebRTC**: Direct peer-to-peer communication via browser APIs
- **PeerJS**: WebRTC abstraction library for simplified connection management

## External Dependencies

- **PeerJS Library**: `https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js`
- **Jest Testing Framework**: `https://unpkg.com/jest-lite@1.0.0-alpha.4/dist/core.js`
- **PeerJS Cloud Server**: Default signaling server for peer discovery
- **Google STUN Server**: `stun:stun.l.google.com:19302` for NAT traversal

## Development Methodology

- **Test-Driven Development (TDD)**: All features developed with tests first
- **100% Test Coverage**: Every function and code path must be tested
- **Single File Architecture**: No build process or bundling required
- **Browser-Based Testing**: All tests run directly in the browser environment

## Common Commands

### Development
```bash
# No build process required - open directly in browser
open chat.html
# or serve locally
python -m http.server 8000
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

### Testing
- Tests run automatically when the HTML file loads
- All test results displayed in the browser interface
- No separate test runner required

### Deployment
- Copy `chat.html` to any web server or CDN
- No compilation or build step needed
- Works with file:// protocol for local testing

## Browser Requirements

- Modern browser with WebRTC DataChannel support
- JavaScript enabled
- HTTPS required for production (WebRTC security requirement)
- Tested on Chrome, Firefox, Safari, and mobile browsers