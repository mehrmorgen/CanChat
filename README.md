# WebRTC PeerJS Chat

A minimal peer-to-peer text chat application that enables direct browser-to-browser communication using WebRTC technology. The application allows two users to connect using unique peer IDs and exchange messages in real-time without requiring a central server for message relay.

## Live Deployment

🚀 **Access the live application**: [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)

## Features

- **Direct P2P Communication**: Messages flow directly between browsers after connection establishment
- **No Server Dependencies**: Uses PeerJS cloud signaling and Google STUN servers for connection setup
- **Modular ESM Architecture**: Native ES modules with separate CSS; no build step required
- **Real-time Messaging**: Instant message delivery between connected peers
- **File Transfer**: Send and receive files with progress indicators and downloads list
- **Audio/Video Calling**: Start a 1:1 call with microphone and camera
- **Screen Sharing**: Share your screen during a call and stop sharing anytime
- **Simple Interface**: Clean, minimal UI focused on core chat, file transfers, and calls

## How to Test

### Multi-Network Testing

1. **Open the application** on two different devices/networks:
   - Device 1: Open [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)
   - Device 2: Open [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)

2. **Wait for Peer IDs**:
   - Each page automatically shows its unique peer ID under "Your Peer ID"

3. **Establish Connection**:
   - On Device 1: Enter Device 2's peer ID and click "Connect"
   - On Device 2: Enter Device 1's peer ID and click "Connect"
   - Wait for the connection status to show "Connected"

4. **Start Chatting**:
   - Type messages in the message input field
   - Click "Send" or press Enter
   - Messages will appear in real-time on both devices

5. **File Transfer (optional)**:
   - Choose a small file via the file picker
   - Click "Send File" and watch the send/receive progress
   - The peer will see a download link under "Downloads"

### Testing Scenarios

- **Same Network**: Test between devices on the same WiFi network
- **Different Networks**: Test between devices on different ISPs/networks
- **Mobile/Desktop**: Test between mobile devices and desktop computers
- **Different Browsers**: Test across Chrome, Firefox, Safari, and mobile browsers

## Technical Requirements

### Browser Support
- Modern browser with WebRTC DataChannel support
- JavaScript enabled
- HTTPS required (automatically provided by GitHub Pages)

### Tested Browsers
- Chrome/Chromium (recommended)
- Firefox
- Safari (desktop and mobile)
- Mobile browsers (iOS Safari, Android Chrome)

## Development

### Development Environment Setup

This application uses cutting-edge JavaScript features (ES2020+) and requires proper IDE configuration for optimal development experience.

#### Quick Setup

1. **Modern Browser**: Use Chrome 88+, Firefox 85+, or Safari 14+
2. **IDE Configuration**: Configure your IDE for ES2020+ JavaScript support
3. **HTTPS Server**: Use HTTPS for local development (WebRTC requirement)

#### Detailed IDE Configuration

For comprehensive IDE setup instructions, configure your IDE for ES2020+ JavaScript support with proper settings for modern JavaScript features.

#### Environment Detection

The application automatically detects your development environment and provides:

- **Development Mode Indicator**: Visual indicator when running locally
- **Compatibility Mode Detection**: Automatic detection of ES2020+ support
- **Environment Information**: Detailed logging of browser and IDE capabilities
- **Troubleshooting Guidance**: Automatic suggestions for common issues

### Local Development

```bash
# Clone the repository
git clone https://github.com/mehrmorgen/CanChat.git
cd CanChat

# Install dependencies
bun install

# Start HTTPS dev server (required for WebRTC)
bun run dev

# Open the app (accept self-signed cert warning)
open https://localhost:8443/chat.html
# or manually visit the URL in your browser
```

Note: If HTTPS certificate files are missing, generate self‑signed certs (development only):

```bash
openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj "/CN=localhost"
```

#### Development Features

When running locally, the application provides additional development features:

- **Environment Indicator**: Shows development mode status in top-right corner
- **Enhanced Logging**: Detailed console output for debugging
- **Compatibility Checks**: Automatic validation of modern JavaScript features
- **IDE Detection**: Identifies your development environment and provides guidance

#### Modern JavaScript Features Used

This application leverages cutting-edge JavaScript features:

- **Optional Chaining** (`?.`): Safe property access
- **Nullish Coalescing** (`??`): Default value assignment
- **BigInt**: Large integer support
- **Private Class Fields** (`#private`): True encapsulation
- **Promise.allSettled**: Advanced promise handling
- **Modern Array Methods**: `flatMap`, `structuredClone`
- **Top-level Await**: Module-level async operations

#### Browser Requirements for Development

- **Chrome 88+** (January 2021) - Recommended for development
- **Firefox 85+** (January 2021) - Full feature support
- **Safari 14+** (September 2020) - WebKit compatibility
- **Edge 88+** (January 2021) - Chromium-based support

#### Troubleshooting Development Issues

**Syntax Errors in IDE**:
- Update JavaScript language version to ES2020+
- Install modern JavaScript extensions
- Configure parser settings for latest features

**WebRTC Not Working Locally**:
- Use HTTPS (required for WebRTC)
- Run `bun run dev` for local HTTPS
- Avoid `file://` protocol for testing

**Modern Features Not Recognized**:
- Check browser version (must be modern)
- Verify IDE configuration for ES2020+
- Configure your IDE for modern JavaScript features

For more detailed troubleshooting, the application's environment detection system will automatically identify issues and provide specific guidance.

### Deployment Process

This application is automatically deployed to GitHub Pages:

1. **Automatic Deployment**: Any push to the `main` branch triggers automatic deployment
2. **No Build Process**: The `chat.html` file is served directly as a static file
3. **HTTPS Enforcement**: GitHub Pages automatically provides HTTPS
4. **Global CDN**: GitHub's CDN ensures fast loading worldwide

#### GitHub Pages Configuration

- **Repository**: `mehrmorgen/CanChat`
- **Source Branch**: `main` (root directory)
- **Deployment URL**: [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)
- **HTTPS Enforced**: Yes (automatic)
- **Custom Domain**: Not configured (using github.io subdomain)

#### URL Sharing Instructions

To share the application for testing:

1. **Direct Link**: Share `https://mehrmorgen.github.io/CanChat/chat.html`
2. **QR Code**: Generate QR code for the URL for mobile device testing
3. **Testing Setup**:
   - Open the URL on both devices (peer IDs appear automatically under "Your Peer ID")
   - Exchange peer IDs and click "Connect" on each device
   - Send messages both ways to verify real-time chat
   - Optionally send a small file to verify file transfer

#### Deployment Verification

- ✅ GitHub Pages enabled on `main` branch
- ✅ `chat.html` accessible at deployment URL
- ✅ HTTPS enforcement active
- ✅ Automatic deployment on push verified
- ✅ WebRTC functionality working over HTTPS

### Repository Structure
```
.
├── chat.html                    # Main application HTML entry point
├── README.md                    # This documentation
├── server.js                    # HTTPS Bun development server
├── src/                         # Source code modules
│   ├── chat.js                  # Main application module (ESM)
│   ├── utils.js                 # Helper functions and utilities (ESM)
│   └── styles.css               # Extracted CSS styles
├── localhost.crt                # SSL certificate for local testing
├── localhost.key                # SSL private key for local testing
├── bunfig.toml                  # Bun configuration
├── package.json                 # Package management and script definitions
├── tests/                       # Test modules
└── .kiro/                       # Kiro IDE configuration and specs
```

## Troubleshooting

### Connection Issues

**Problem**: "Failed to connect to peer"
- **Solution**: Ensure both devices are using HTTPS (GitHub Pages URL)
- **Check**: Verify peer IDs are entered correctly
- **Network**: Some corporate firewalls may block WebRTC

**Problem**: WebRTC not working
- **Solution**: Use the GitHub Pages HTTPS URL, not local file:// protocol
- **Browser**: Ensure you're using a modern browser with WebRTC support

**Problem**: Can't generate peer ID
- **Solution**: Check browser console for errors
- **Network**: Ensure PeerJS cloud server is accessible

### Performance Issues

**Problem**: Slow connection establishment
- **Cause**: NAT traversal may take time on some networks
- **Solution**: Wait up to 30 seconds for connection establishment

**Problem**: Messages not appearing
- **Check**: Verify connection status shows "Connected!"
- **Retry**: Try refreshing both pages and reconnecting

## Testing

Run unit tests with Bun:

```bash
bun test
bun test --watch
bun test --coverage
```

Note: Optional browser automation examples using Playwright are available (see `tests/automation`). These require the HTTPS dev server to be running and are not part of the default test script.

## Contributing

1. Fork the repository
2. Make changes in `src/` (e.g., `src/chat.js`, `src/utils.js`, `src/styles.css`) and `chat.html` as needed
3. Run tests locally (see Testing) and verify over HTTPS (`bun run dev` then open https://localhost:8443/chat.html)
4. Submit a pull request

## License

This project is open source and available under the MIT License.