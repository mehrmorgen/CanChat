# Technology Stack

## Core Technologies

- **HTML5**: Single-file application with modern semantic markup
- **CSS3**: Modern CSS features (Grid, Flexbox, Custom Properties) inline
- **JavaScript (Latest)**: Cutting-edge vanilla JavaScript using the most recent features available in current Firefox, Safari, and Chrome
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
- **Single File Architecture**: No build process, bundling, or transpilation
- **Modern Browser Testing**: Tests run natively in modern browser environments
- **Modern-First Development**: Use the latest JavaScript features and browser APIs without any backwards compatibility considerations

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
- Works on Github Pages

## Browser Requirements

- **Latest browsers only**: Current versions of Chrome, Firefox, and Safari (latest stable releases)
- **Cutting-edge features**: Use the newest JavaScript syntax, WebRTC APIs, and browser capabilities available
- **No compatibility layers**: Zero polyfills, transpilation, or legacy browser support
- **Modern APIs only**: Leverage the most recent DOM, Web, and JavaScript APIs
- **HTTPS required for production**: WebRTC getUserMedia and connection security requirement
- **Mobile-first responsive**: Latest mobile browser versions with newest features
