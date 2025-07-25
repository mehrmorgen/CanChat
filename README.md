# WebRTC PeerJS Chat

A minimal peer-to-peer text chat application that enables direct browser-to-browser communication using WebRTC technology. The application allows two users to connect using unique peer IDs and exchange messages in real-time without requiring a central server for message relay.

## Live Deployment

🚀 **Access the live application**: [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)

## Features

- **Direct P2P Communication**: Messages flow directly between browsers after connection establishment
- **No Server Dependencies**: Uses PeerJS cloud signaling and Google STUN servers for connection setup
- **Single File Application**: Entirely self-contained HTML file with no build process required
- **Real-time Messaging**: Instant message delivery between connected peers
- **Simple Interface**: Clean, minimal UI focused on core chat functionality

## How to Test

### Multi-Network Testing

1. **Open the application** on two different devices/networks:
   - Device 1: Open [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)
   - Device 2: Open [https://mehrmorgen.github.io/CanChat/chat.html](https://mehrmorgen.github.io/CanChat/chat.html)

2. **Generate Peer IDs**:
   - Click "Generate My Peer ID" on both devices
   - Each device will get a unique peer ID

3. **Establish Connection**:
   - On Device 1: Enter Device 2's peer ID and click "Connect to Peer"
   - On Device 2: Enter Device 1's peer ID and click "Connect to Peer"
   - Wait for "Connected!" message to appear

4. **Start Chatting**:
   - Type messages in the message input field
   - Click "Send Message" or press Enter
   - Messages will appear in real-time on both devices

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

### Local Development
```bash
# Clone the repository
git clone https://github.com/mehrmorgen/CanChat.git
cd CanChat

# Serve locally (HTTPS required for WebRTC)
python test_https_server.py

# Or use any local HTTPS server
# The application is a single HTML file with no build process
```

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
   - Person A opens the URL and generates a peer ID
   - Person B opens the URL and generates a peer ID
   - Both persons exchange peer IDs and connect
   - Start chatting to test cross-network functionality

#### Deployment Verification

- ✅ GitHub Pages enabled on `main` branch
- ✅ `chat.html` accessible at deployment URL
- ✅ HTTPS enforcement active
- ✅ Automatic deployment on push verified
- ✅ WebRTC functionality working over HTTPS

### Repository Structure
```
.
├── chat.html                    # Main application (single-file architecture)
├── README.md                    # This documentation
├── test_https_server.py         # Local HTTPS development server
├── server.crt                   # SSL certificate for local testing
├── server.key                   # SSL private key for local testing
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

## Contributing

1. Fork the repository
2. Make changes to `chat.html`
3. Test locally using HTTPS server
4. Submit a pull request
5. Changes will be automatically deployed upon merge

## License

This project is open source and available under the MIT License.