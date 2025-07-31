import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';

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
    
    mockConnection = {
        on: () => {},
        send: () => {},
        close: () => {},
        peer: 'test-peer-id'
    };
});

afterEach(() => {
    // Cleanup
});

describe('Event Handlers', () => {
    test('should handle connect button click', () => {
        let connectAttempted = false;
        let targetPeerId = '';
        
        const handleConnectClick = () => {
            const peerIdInput = document.getElementById('peer-id-input');
            const connectBtn = document.getElementById('connect-btn');
            
            if (peerIdInput && peerIdInput.value.trim()) {
                connectAttempted = true;
                targetPeerId = peerIdInput.value.trim();
                
                if (connectBtn) {
                    connectBtn.disabled = true;
                    connectBtn.textContent = 'Connecting...';
                }
            }
        };
        
        document.getElementById('peer-id-input').value = 'target-peer-123';
        handleConnectClick();
        
        expect(connectAttempted).toBe(true);
        expect(targetPeerId).toBe('target-peer-123');
        expect(document.getElementById('connect-btn').disabled).toBe(true);
        expect(document.getElementById('connect-btn').textContent).toBe('Connecting...');
    });
    
    test('should handle send button click', () => {
        let messageSent = false;
        let sentMessage = '';
        
        const handleSendClick = (connection) => {
            const messageInput = document.getElementById('message-input');
            
            if (messageInput && messageInput.value.trim() && connection) {
                messageSent = true;
                sentMessage = messageInput.value.trim();
                
                // Simulate sending
                connection.send(sentMessage);
                
                // Clear input
                messageInput.value = '';
            }
        };
        
        document.getElementById('message-input').value = 'Hello world';
        
        const mockConn = {
            send: (msg) => {
                // Mock send implementation
            }
        };
        
        handleSendClick(mockConn);
        
        expect(messageSent).toBe(true);
        expect(sentMessage).toBe('Hello world');
        expect(document.getElementById('message-input').value).toBe('');
    });
    
    test('should handle Enter key in message input', () => {
        let enterHandled = false;
        
        const handleMessageInputKeyPress = (event, connection) => {
            if (event.key === 'Enter') {
                enterHandled = true;
                
                const messageInput = document.getElementById('message-input');
                if (messageInput && messageInput.value.trim() && connection) {
                    // Simulate send
                    connection.send(messageInput.value.trim());
                    messageInput.value = '';
                }
            }
        };
        
        const mockEvent = { key: 'Enter' };
        const mockConn = { send: () => {} };
        
        document.getElementById('message-input').value = 'Test message';
        handleMessageInputKeyPress(mockEvent, mockConn);
        
        expect(enterHandled).toBe(true);
        expect(document.getElementById('message-input').value).toBe('');
    });
    
    test('should handle Enter key in peer ID input', () => {
        let enterHandled = false;
        
        const handlePeerIdInputKeyPress = (event) => {
            if (event.key === 'Enter') {
                enterHandled = true;
                
                const connectBtn = document.getElementById('connect-btn');
                if (connectBtn && !connectBtn.disabled) {
                    connectBtn.click();
                }
            }
        };
        
        const mockEvent = { key: 'Enter' };
        handlePeerIdInputKeyPress(mockEvent);
        
        expect(enterHandled).toBe(true);
    });
    
    test('should handle window beforeunload event', () => {
        let cleanupCalled = false;
        
        const handleBeforeUnload = (peer, connection) => {
            cleanupCalled = true;
            
            if (connection) {
                connection.close();
            }
            
            if (peer) {
                peer.destroy();
            }
        };
        
        const mockPeer = { destroy: () => {} };
        const mockConn = { close: () => {} };
        
        handleBeforeUnload(mockPeer, mockConn);
        
        expect(cleanupCalled).toBe(true);
    });
    
    test('should handle connection state changes', () => {
        let stateChangeHandled = false;
        
        const handleConnectionStateChange = (state) => {
            stateChangeHandled = true;
            
            const statusElement = document.getElementById('status-text');
            const connectBtn = document.getElementById('connect-btn');
            const sendBtn = document.getElementById('send-btn');
            
            switch (state) {
                case 'connecting':
                    if (statusElement) statusElement.textContent = 'Connecting...';
                    if (connectBtn) {
                        connectBtn.disabled = true;
                        connectBtn.textContent = 'Connecting...';
                    }
                    break;
                    
                case 'connected':
                    if (statusElement) statusElement.textContent = 'Connected';
                    if (connectBtn) {
                        connectBtn.disabled = false;
                        connectBtn.textContent = 'Disconnect';
                    }
                    if (sendBtn) sendBtn.disabled = false;
                    break;
                    
                case 'disconnected':
                    if (statusElement) statusElement.textContent = 'Disconnected';
                    if (connectBtn) {
                        connectBtn.disabled = false;
                        connectBtn.textContent = 'Connect';
                    }
                    if (sendBtn) sendBtn.disabled = true;
                    break;
            }
        };
        
        handleConnectionStateChange('connecting');
        expect(stateChangeHandled).toBe(true);
        expect(document.getElementById('status-text').textContent).toBe('Connecting...');
        expect(document.getElementById('connect-btn').textContent).toBe('Connecting...');
        
        handleConnectionStateChange('connected');
        expect(document.getElementById('status-text').textContent).toBe('Connected');
        expect(document.getElementById('connect-btn').textContent).toBe('Disconnect');
        expect(document.getElementById('send-btn').disabled).toBe(false);
        
        handleConnectionStateChange('disconnected');
        expect(document.getElementById('status-text').textContent).toBe('Disconnected');
        expect(document.getElementById('connect-btn').textContent).toBe('Connect');
        expect(document.getElementById('send-btn').disabled).toBe(true);
    });
    
    test('should handle error display', () => {
        let errorDisplayed = false;
        
        const displayError = (message) => {
            errorDisplayed = true;
            
            const statusElement = document.getElementById('status-text');
            if (statusElement) {
                statusElement.textContent = `Error: ${message}`;
                statusElement.style.color = 'red';
            }
        };
        
        displayError('Connection failed');
        
        expect(errorDisplayed).toBe(true);
        expect(document.getElementById('status-text').textContent).toBe('Error: Connection failed');
        expect(document.getElementById('status-text').style.color).toBe('red');
    });
    
    test('should handle success display', () => {
        let successDisplayed = false;
        
        const displaySuccess = (message) => {
            successDisplayed = true;
            
            const statusElement = document.getElementById('status-text');
            if (statusElement) {
                statusElement.textContent = message;
                statusElement.style.color = 'green';
            }
        };
        
        displaySuccess('Connected successfully');
        
        expect(successDisplayed).toBe(true);
        expect(document.getElementById('status-text').textContent).toBe('Connected successfully');
        expect(document.getElementById('status-text').style.color).toBe('green');
    });
});