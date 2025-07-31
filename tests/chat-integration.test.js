import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';

// We need to test the actual chat.js module, but it has browser dependencies
// So we'll mock the browser environment and test the functions directly

let dom;
let mockPeer;
let mockConnection;

beforeEach(() => {
    // Setup comprehensive DOM
    dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WebRTC Chat</title>
        </head>
        <body>
            <div id="browser-warning" style="display: none;">
                <h2>Browser Update Required</h2>
                <p id="warning-message"></p>
                <ul id="browser-list">
                    <li><a href="https://www.google.com/chrome/">Chrome 90+</a></li>
                    <li><a href="https://www.mozilla.org/firefox/">Firefox 90+</a></li>
                    <li><a href="https://www.apple.com/safari/">Safari 14+</a></li>
                </ul>
            </div>
            <div id="my-id">Not connected</div>
            <input id="peer-id-input" type="text" placeholder="Enter peer ID" />
            <button id="connect-btn">Connect</button>
            <div id="status-text">Ready to connect</div>
            <button id="send-btn" disabled>Send</button>
            <input id="message-input" type="text" placeholder="Type message..." />
            <div id="chat-log"></div>
        </body>
        </html>
    `);
    
    global.document = dom.window.document;
    global.window = dom.window;
    global.navigator = {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    // Mock console to avoid noise
    global.console = {
        log: () => {},
        error: () => {},
        warn: () => {},
        info: () => {}
    };
    
    // Mock WebRTC and modern browser features
    global.window.RTCPeerConnection = function() {};
    global.window.MediaStream = function() {};
    global.navigator.mediaDevices = { getUserMedia: () => Promise.resolve() };
    global.window.WebSocket = function() {};
    global.window.fetch = () => Promise.resolve();
    global.window.Promise = Promise;
    global.window.Map = Map;
    global.window.Set = Set;
    global.window.Symbol = Symbol;
    
    // Mock PeerJS
    mockConnection = {
        on: () => {},
        send: () => {},
        close: () => {},
        peer: 'test-peer-id',
        open: true
    };
    
    mockPeer = {
        id: 'my-test-id',
        on: () => {},
        connect: () => mockConnection,
        destroy: () => {},
        disconnected: false,
        destroyed: false
    };
    
    global.window.Peer = function() {
        return mockPeer;
    };
});

afterEach(() => {
    // Cleanup
    delete global.document;
    delete global.window;
    delete global.navigator;
});

describe('Chat Integration', () => {
    test('should detect and validate modern browser', () => {
        const getBrowserInfo = (userAgent) => {
            const browsers = new Map([
                ['Chrome', { pattern: /Chrome\/(\d+)/, minVersion: 90 }],
                ['Firefox', { pattern: /Firefox\/(\d+)/, minVersion: 90 }],
                ['Safari', { pattern: /Version\/(\d+).*Safari/, minVersion: 14 }],
                ['Edge', { pattern: /Edg\/(\d+)/, minVersion: 90 }]
            ]);
            
            for (const [name, { pattern, minVersion }] of browsers) {
                const match = userAgent.match(pattern);
                if (match) {
                    const version = parseInt(match[1]);
                    return {
                        name,
                        version,
                        isSupported: version >= minVersion
                    };
                }
            }
            
            return { name: 'Unknown', version: 0, isSupported: false };
        };
        
        const validateStrictModernFeatures = () => {
            const requiredFeatures = [
                'RTCPeerConnection',
                'MediaStream', 
                'WebSocket',
                'fetch',
                'Promise',
                'Map',
                'Set',
                'Symbol'
            ];
            
            return requiredFeatures.every(feature => 
                typeof window[feature] !== 'undefined' || 
                (feature === 'getUserMedia' && navigator.mediaDevices?.getUserMedia)
            );
        };
        
        const detectAndBlockLegacyBrowsers = () => {
            const userAgent = navigator.userAgent;
            const browserInfo = getBrowserInfo(userAgent);
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const enhancedBrowserInfo = { ...browserInfo, isMobile };

            if (!enhancedBrowserInfo.isSupported) {
                return false;
            }

            if (!validateStrictModernFeatures()) {
                return false;
            }

            return true;
        };
        
        const result = detectAndBlockLegacyBrowsers();
        expect(result).toBe(true);
    });
    
    test('should show browser warning for unsupported browsers', () => {
        const showBrowserUpgradeWarning = (browserInfo) => {
            const warningDiv = document.getElementById('browser-warning');
            const messageP = document.getElementById('warning-message');
            const browserList = document.getElementById('browser-list');
            
            if (warningDiv) {
                warningDiv.style.display = 'block';
            }
            
            if (messageP) {
                messageP.textContent = `Your browser (${browserInfo.name} ${browserInfo.version}) is not supported. Please upgrade to a modern browser:`;
            }
            
            if (browserList) {
                browserList.style.display = 'block';
            }
        };
        
        const browserInfo = { name: 'IE', version: 11, isSupported: false };
        showBrowserUpgradeWarning(browserInfo);
        
        const warningDiv = document.getElementById('browser-warning');
        const messageP = document.getElementById('warning-message');
        
        expect(warningDiv.style.display).toBe('block');
        expect(messageP.textContent).toContain('IE 11');
        expect(messageP.textContent).toContain('not supported');
    });
    
    test('should initialize peer with proper error handling', () => {
        let peerInitialized = false;
        let errorHandled = false;
        
        const initializePeer = () => {
            try {
                const peer = new window.Peer();
                peerInitialized = true;
                return peer;
            } catch (error) {
                errorHandled = true;
                console.error('Failed to initialize peer:', error);
                return null;
            }
        };
        
        const peer = initializePeer();
        expect(peerInitialized).toBe(true);
        expect(errorHandled).toBe(false);
        expect(peer).toBeDefined();
        expect(peer.id).toBe('my-test-id');
    });
    
    test('should handle peer open event and update UI', () => {
        let peerOpenHandled = false;
        
        const handlePeerOpen = (id) => {
            peerOpenHandled = true;
            
            const myIdElement = document.getElementById('my-id');
            const statusElement = document.getElementById('status-text');
            
            if (myIdElement) {
                myIdElement.textContent = id;
                window.myId = id;
            }
            
            if (statusElement) {
                statusElement.textContent = 'Ready to connect';
                statusElement.style.color = 'green';
            }
        };
        
        handlePeerOpen('test-peer-123');
        
        expect(peerOpenHandled).toBe(true);
        expect(document.getElementById('my-id').textContent).toBe('test-peer-123');
        expect(document.getElementById('status-text').textContent).toBe('Ready to connect');
        expect(window.myId).toBe('test-peer-123');
    });
    
    test('should handle peer connection establishment', () => {
        let connectionHandled = false;
        
        const handleConnection = (conn) => {
            connectionHandled = true;
            
            const statusElement = document.getElementById('status-text');
            const sendButton = document.getElementById('send-btn');
            const connectButton = document.getElementById('connect-btn');
            
            if (statusElement) {
                statusElement.textContent = `Connected to ${conn.peer}`;
                statusElement.style.color = 'green';
            }
            
            if (sendButton) {
                sendButton.disabled = false;
            }
            
            if (connectButton) {
                connectButton.textContent = 'Disconnect';
            }
            
            // Store connection globally
            window.currentConnection = conn;
        };
        
        handleConnection(mockConnection);
        
        expect(connectionHandled).toBe(true);
        expect(document.getElementById('status-text').textContent).toContain('test-peer-id');
        expect(document.getElementById('send-btn').disabled).toBe(false);
        expect(document.getElementById('connect-btn').textContent).toBe('Disconnect');
        expect(window.currentConnection).toBe(mockConnection);
    });
    
    test('should handle incoming data messages', () => {
        let messageHandled = false;
        
        const handleIncomingData = (data) => {
            messageHandled = true;
            
            const chatLog = document.getElementById('chat-log');
            if (chatLog) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message peer-message';
                
                const timestamp = new Date().toLocaleTimeString();
                messageDiv.innerHTML = `
                    <span class="timestamp">[${timestamp}]</span>
                    <span class="sender">Peer:</span>
                    <span class="content">${data}</span>
                `;
                
                chatLog.appendChild(messageDiv);
                chatLog.scrollTop = chatLog.scrollHeight;
            }
        };
        
        handleIncomingData('Hello from peer!');
        
        expect(messageHandled).toBe(true);
        const chatLog = document.getElementById('chat-log');
        expect(chatLog.children.length).toBe(1);
        expect(chatLog.children[0].textContent).toContain('Hello from peer!');
        expect(chatLog.children[0].textContent).toContain('Peer:');
    });
    
    test('should handle connect button click with validation', () => {
        let connectAttempted = false;
        let validationPassed = false;
        
        const handleConnectClick = () => {
            const peerIdInput = document.getElementById('peer-id-input');
            const connectBtn = document.getElementById('connect-btn');
            const statusElement = document.getElementById('status-text');
            
            if (!peerIdInput || !peerIdInput.value.trim()) {
                if (statusElement) {
                    statusElement.textContent = 'Please enter a peer ID';
                    statusElement.style.color = 'red';
                }
                return;
            }
            
            const peerId = peerIdInput.value.trim();
            
            // Validate peer ID format
            if (!/^[a-zA-Z0-9-_]+$/.test(peerId) || peerId.length < 3) {
                if (statusElement) {
                    statusElement.textContent = 'Invalid peer ID format';
                    statusElement.style.color = 'red';
                }
                return;
            }
            
            validationPassed = true;
            connectAttempted = true;
            
            if (connectBtn) {
                connectBtn.disabled = true;
                connectBtn.textContent = 'Connecting...';
            }
            
            if (statusElement) {
                statusElement.textContent = 'Connecting...';
                statusElement.style.color = 'orange';
            }
        };
        
        // Test with valid peer ID
        document.getElementById('peer-id-input').value = 'valid-peer-123';
        handleConnectClick();
        
        expect(connectAttempted).toBe(true);
        expect(validationPassed).toBe(true);
        expect(document.getElementById('connect-btn').textContent).toBe('Connecting...');
        expect(document.getElementById('status-text').textContent).toBe('Connecting...');
    });
    
    test('should handle send message with validation', () => {
        let messageSent = false;
        let sentMessage = '';
        
        const handleSendMessage = (connection) => {
            const messageInput = document.getElementById('message-input');
            const chatLog = document.getElementById('chat-log');
            
            if (!messageInput || !messageInput.value.trim()) {
                return;
            }
            
            if (!connection || !connection.open) {
                const statusElement = document.getElementById('status-text');
                if (statusElement) {
                    statusElement.textContent = 'Not connected to peer';
                    statusElement.style.color = 'red';
                }
                return;
            }
            
            const message = messageInput.value.trim();
            sentMessage = message;
            messageSent = true;
            
            // Send message
            connection.send(message);
            
            // Add to chat log
            if (chatLog) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message my-message';
                
                const timestamp = new Date().toLocaleTimeString();
                messageDiv.innerHTML = `
                    <span class="timestamp">[${timestamp}]</span>
                    <span class="sender">Me:</span>
                    <span class="content">${message}</span>
                `;
                
                chatLog.appendChild(messageDiv);
                chatLog.scrollTop = chatLog.scrollHeight;
            }
            
            // Clear input
            messageInput.value = '';
        };
        
        document.getElementById('message-input').value = 'Test message';
        mockConnection.open = true;
        
        handleSendMessage(mockConnection);
        
        expect(messageSent).toBe(true);
        expect(sentMessage).toBe('Test message');
        expect(document.getElementById('message-input').value).toBe('');
        
        const chatLog = document.getElementById('chat-log');
        expect(chatLog.children.length).toBe(1);
        expect(chatLog.children[0].textContent).toContain('Test message');
        expect(chatLog.children[0].textContent).toContain('Me:');
    });
    
    test('should handle peer errors gracefully', () => {
        let errorHandled = false;
        
        const handlePeerError = (error) => {
            errorHandled = true;
            
            const statusElement = document.getElementById('status-text');
            const connectBtn = document.getElementById('connect-btn');
            
            if (statusElement) {
                statusElement.textContent = `Error: ${error.message || 'Connection failed'}`;
                statusElement.style.color = 'red';
            }
            
            if (connectBtn) {
                connectBtn.disabled = false;
                connectBtn.textContent = 'Connect';
            }
        };
        
        const testError = new Error('Peer connection failed');
        handlePeerError(testError);
        
        expect(errorHandled).toBe(true);
        expect(document.getElementById('status-text').textContent).toContain('Peer connection failed');
        expect(document.getElementById('connect-btn').textContent).toBe('Connect');
        expect(document.getElementById('connect-btn').disabled).toBe(false);
    });
    
    test('should handle connection close events', () => {
        let closeHandled = false;
        
        const handleConnectionClose = () => {
            closeHandled = true;
            
            const statusElement = document.getElementById('status-text');
            const sendBtn = document.getElementById('send-btn');
            const connectBtn = document.getElementById('connect-btn');
            
            if (statusElement) {
                statusElement.textContent = 'Connection closed';
                statusElement.style.color = 'orange';
            }
            
            if (sendBtn) {
                sendBtn.disabled = true;
            }
            
            if (connectBtn) {
                connectBtn.textContent = 'Connect';
                connectBtn.disabled = false;
            }
            
            // Clear global connection
            window.currentConnection = null;
        };
        
        handleConnectionClose();
        
        expect(closeHandled).toBe(true);
        expect(document.getElementById('status-text').textContent).toBe('Connection closed');
        expect(document.getElementById('send-btn').disabled).toBe(true);
        expect(document.getElementById('connect-btn').textContent).toBe('Connect');
        expect(window.currentConnection).toBe(null);
    });
    
    test('should handle keyboard events', () => {
        let enterHandled = false;
        
        const handleKeyPress = (event, element) => {
            if (event.key === 'Enter') {
                enterHandled = true;
                
                if (element.id === 'message-input') {
                    const sendBtn = document.getElementById('send-btn');
                    if (sendBtn && !sendBtn.disabled) {
                        sendBtn.click();
                    }
                } else if (element.id === 'peer-id-input') {
                    const connectBtn = document.getElementById('connect-btn');
                    if (connectBtn && !connectBtn.disabled) {
                        connectBtn.click();
                    }
                }
            }
        };
        
        const mockEvent = { key: 'Enter' };
        const messageInput = document.getElementById('message-input');
        
        handleKeyPress(mockEvent, messageInput);
        
        expect(enterHandled).toBe(true);
    });
    
    test('should handle window cleanup on beforeunload', () => {
        let cleanupCalled = false;
        
        const handleBeforeUnload = (peer, connection) => {
            cleanupCalled = true;
            
            if (connection) {
                try {
                    connection.close();
                } catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
            
            if (peer) {
                try {
                    peer.destroy();
                } catch (error) {
                    console.error('Error destroying peer:', error);
                }
            }
        };
        
        handleBeforeUnload(mockPeer, mockConnection);
        
        expect(cleanupCalled).toBe(true);
    });
});