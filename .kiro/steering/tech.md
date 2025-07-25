# Technology Stack

## Core Technologies

- **HTML5**: Single-file application with modern semantic markup
- **CSS3**: Modern CSS features (Grid, Flexbox, Custom Properties) inline
- **JavaScript (ES2020+)**: Modern vanilla JavaScript with native modules, async/await
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
- **Progressive Enhancement**: Start with modern features, no legacy fallbacks

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

- **Modern browsers only**: Chrome 88+, Firefox 85+, Safari 14+ (last 2 major versions)
- **Native WebRTC support**: No polyfills, shims, or legacy browser compatibility layers
- **Modern JavaScript**: ES2020+ features used without transpilation or Babel
- **HTTPS required for production**: WebRTC getUserMedia and connection security requirement
- **Mobile-first responsive**: Recent mobile browser versions prioritized
