import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';

let mockPeer;
let mockConnection;

beforeEach(() => {
    // Setup DOM
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <div id="my-id">Not connected</div>
            <input id="peer-id-input" type="text" />
            <button id="connect-btn">Connect</button>
            <div id="status-text">Ready to connect</div>
            <button id="send-btn" disabled>Send</button>
            <input id="message-input" type="text" />
            <div id="chat-log"></div>
        </body>
        </html>
    `);
    
    global.document = dom.window.document;
    global.window = dom.window;
    
    // Mock PeerJS
    mockConnection = {
        on: () => {},
        send: () => {},
        close: () => {},
        peer: 'test-peer-id'
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
});

describe('PeerJS Integration', () => {
    test('should initialize peer with random ID generation', async () => {
        const generateRandomId = () => {
            return Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
        };
        
        const id = generateRandomId();
        expect(id).toBeDefined();
        expect(id.length).toBeGreaterThan(10);
        expect(typeof id).toBe('string');
    });
    
    test('should handle peer initialization with error handling', () => {
        let errorHandled = false;
        
        const initializePeer = () => {
            try {
                const peer = new window.Peer();
                return peer;
            } catch (error) {
                errorHandled = true;
                return null;
            }
        };
        
        const peer = initializePeer();
        expect(peer).toBeDefined();
        expect(errorHandled).toBe(false);
    });
    
    test('should handle peer open event', () => {
        let peerIdUpdated = false;
        let statusUpdated = false;
        
        const handlePeerOpen = (id) => {
            const myIdElement = document.getElementById('my-id');
            const statusElement = document.getElementById('status-text');
            
            if (myIdElement) {
                myIdElement.textContent = id;
                peerIdUpdated = true;
            }
            
            if (statusElement) {
                statusElement.textContent = 'Ready to connect';
                statusUpdated = true;
            }
        };
        
        handlePeerOpen('test-peer-id');
        
        expect(peerIdUpdated).toBe(true);
        expect(statusUpdated).toBe(true);
        expect(document.getElementById('my-id').textContent).toBe('test-peer-id');
    });
    
    test('should handle peer connection establishment', () => {
        let connectionEstablished = false;
        
        const handleConnection = (conn) => {
            if (conn && conn.peer) {
                connectionEstablished = true;
                
                const statusElement = document.getElementById('status-text');
                const sendButton = document.getElementById('send-btn');
                
                if (statusElement) {
                    statusElement.textContent = `Connected to ${conn.peer}`;
                }
                
                if (sendButton) {
                    sendButton.disabled = false;
                }
            }
        };
        
        handleConnection(mockConnection);
        
        expect(connectionEstablished).toBe(true);
        expect(document.getElementById('status-text').textContent).toContain('test-peer-id');
        expect(document.getElementById('send-btn').disabled).toBe(false);
    });
    
    test('should handle peer connection errors', () => {
        let errorHandled = false;
        
        const handlePeerError = (error) => {
            errorHandled = true;
            
            const statusElement = document.getElementById('status-text');
            if (statusElement) {
                statusElement.textContent = `Connection error: ${error.message || 'Unknown error'}`;
            }
        };
        
        const testError = new Error('Connection failed');
        handlePeerError(testError);
        
        expect(errorHandled).toBe(true);
        expect(document.getElementById('status-text').textContent).toContain('Connection failed');
    });
    
    test('should handle peer disconnection', () => {
        let disconnectionHandled = false;
        
        const handlePeerDisconnect = () => {
            disconnectionHandled = true;
            
            const statusElement = document.getElementById('status-text');
            const sendButton = document.getElementById('send-btn');
            
            if (statusElement) {
                statusElement.textContent = 'Disconnected';
            }
            
            if (sendButton) {
                sendButton.disabled = true;
            }
        };
        
        handlePeerDisconnect();
        
        expect(disconnectionHandled).toBe(true);
        expect(document.getElementById('status-text').textContent).toBe('Disconnected');
        expect(document.getElementById('send-btn').disabled).toBe(true);
    });
    
    test('should handle message sending', () => {
        let messageSent = false;
        let sentMessage = '';
        
        const mockConn = {
            send: (message) => {
                messageSent = true;
                sentMessage = message;
            }
        };
        
        const sendMessage = (connection, message) => {
            if (connection && message.trim()) {
                connection.send(message);
                
                // Clear input
                const messageInput = document.getElementById('message-input');
                if (messageInput) {
                    messageInput.value = '';
                }
            }
        };
        
        document.getElementById('message-input').value = 'Test message';
        sendMessage(mockConn, 'Test message');
        
        expect(messageSent).toBe(true);
        expect(sentMessage).toBe('Test message');
        expect(document.getElementById('message-input').value).toBe('');
    });
    
    test('should handle incoming messages', () => {
        let messageReceived = false;
        
        const handleIncomingMessage = (data) => {
            messageReceived = true;
            
            const chatLog = document.getElementById('chat-log');
            if (chatLog) {
                const messageDiv = document.createElement('div');
                messageDiv.textContent = `Peer: ${data}`;
                chatLog.appendChild(messageDiv);
            }
        };
        
        handleIncomingMessage('Hello from peer');
        
        expect(messageReceived).toBe(true);
        const chatLog = document.getElementById('chat-log');
        expect(chatLog.children.length).toBe(1);
        expect(chatLog.children[0].textContent).toContain('Hello from peer');
    });
    
    test('should validate peer ID format', () => {
        const validatePeerIdFormat = (peerId) => {
            if (!peerId || typeof peerId !== 'string') return false;
            if (peerId.trim().length === 0) return false;
            if (peerId.length < 3 || peerId.length > 50) return false;
            return /^[a-zA-Z0-9-_]+$/.test(peerId);
        };
        
        expect(validatePeerIdFormat('valid-peer-123')).toBe(true);
        expect(validatePeerIdFormat('test_peer')).toBe(true);
        expect(validatePeerIdFormat('')).toBe(false);
        expect(validatePeerIdFormat('ab')).toBe(false);
        expect(validatePeerIdFormat('invalid peer id')).toBe(false);
        expect(validatePeerIdFormat(null)).toBe(false);
    });
});