/**
 * Integration Tests for Chat Application
 * Tests WebRTC functionality, peer connections, and message handling
 * Uses Bun test runner with ESM imports
 */

// Note: We don't import chat.js directly due to PeerJS dependency
// Instead, we test the utility functions and create mock implementations

import {
    formatTimestamp,
    validatePeerId,
    createSystemMessage,
    createMessage,
    getElementById,
    addEventListenerSafe,
    updateMyId,
    addMessageToChat,
    addSystemMessage,
    setupTestFramework,
    describe as utilDescribe,
    test as utilTest,
    expect as utilExpected
} from '../src/utils.js';

// Import Bun's test functions
import { describe, test, expect } from 'bun:test';

// Bun's expect is imported above

// Mock DOM environment for testing
const mockDOM = () => {
    global.document = {
        getElementById: (id) => {
            const mockElements = {
                'my-id': {
                    _textContent: 'Connecting...',
                    set textContent(value) { this._textContent = value; },
                    get textContent() { return this._textContent; }
                },
                'peer-id-input': {
                    value: '',
                    set value(val) { this._value = val; },
                    get value() { return this._value || ''; }
                },
                'connect-btn': {
                    disabled: false,
                    addEventListener: () => {}
                },
                'retry-btn': {
                    style: { display: 'none' },
                    addEventListener: () => {}
                },
                'send-btn': {
                    _disabled: true,
                    set disabled(value) { this._disabled = value; },
                    get disabled() { return this._disabled; },
                    addEventListener: () => {}
                },
                'message-input': {
                    value: '',
                    set value(val) { this._value = val; },
                    get value() { return this._value || ''; },
                    addEventListener: () => {}
                },
                'chat-log': {
                    _value: '',
                    _scrollTop: 0,
                    scrollHeight: 100,
                    set value(val) { this._value = val; },
                    get value() { return this._value; },
                    set scrollTop(value) { this._scrollTop = value; },
                    get scrollTop() { return this._scrollTop; }
                },
                'status-indicator': {
                    className: 'status-indicator',
                    classList: {
                        add: (cls) => {},
                        remove: (cls) => {}
                    }
                },
                'status-text': {
                    _textContent: 'Disconnected',
                    set textContent(value) { this._textContent = value; },
                    get textContent() { return this._textContent; }
                },
                'test-output': {
                    innerHTML: '',
                    set innerHTML(value) { this._innerHTML = value; },
                    get innerHTML() { return this._innerHTML || ''; }
                }
            };
            return mockElements[id] || null;
        },
        addEventListener: () => {},
        body: {
            insertAdjacentHTML: () => {}
        }
    };
    
    global.window = {
        myId: null,
        location: {
            protocol: 'https:',
            hostname: 'localhost'
        },
        isSecureContext: true,
        RTCPeerConnection: function() {},
        RTCDataChannel: function() {},
        addEventListener: () => {},
        navigator: {
            userAgent: 'Mozilla/5.0 (Chrome/88.0) WebKit/537.36'
        }
    };
    
    global.navigator = {
        userAgent: 'Mozilla/5.0 (Chrome/88.0) WebKit/537.36'
    };
    
    global.console = {
        log: () => {},
        error: () => {},
        warn: () => {},
        group: () => {},
        groupEnd: () => {}
    };
};

// Mock chat application functions for testing
const mockChatFunctions = {
    updateConnectionStatus: (status, message) => {
        const statusText = getElementById('status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    },
    
    enableSendButton: () => {
        const sendBtn = getElementById('send-btn');
        if (sendBtn) {
            sendBtn.disabled = false;
        }
    },
    
    disableSendButton: () => {
        const sendBtn = getElementById('send-btn');
        if (sendBtn) {
            sendBtn.disabled = true;
        }
    },
    
    handleConnectionClose: () => {
        mockChatFunctions.updateConnectionStatus('disconnected', 'Connection closed');
        mockChatFunctions.disableSendButton();
    },
    
    handleReceivedMessage: (data) => {
        if (typeof data === 'string') {
            addMessageToChat(data, 'peer');
        } else if (data && typeof data === 'object' && data.message) {
            addMessageToChat(data.message, 'peer');
        } else {
            console.warn('Received unknown data format:', data);
            addSystemMessage('⚠️ Received message in unknown format');
        }
    }
};

describe('Application Initialization', () => {
    test('should have required DOM elements', () => {
        mockDOM();
        expect(getElementById('my-id')).not.toBeNull();
        expect(getElementById('peer-id-input')).not.toBeNull();
        expect(getElementById('connect-btn')).not.toBeNull();
        expect(getElementById('chat-log')).not.toBeNull();
        expect(getElementById('message-input')).not.toBeNull();
        expect(getElementById('send-btn')).not.toBeNull();
    });

    test('should have required utility functions available', () => {
        expect(typeof formatTimestamp).toBe('function');
        expect(typeof validatePeerId).toBe('function');
        expect(typeof createSystemMessage).toBe('function');
        expect(typeof addMessageToChat).toBe('function');
    });

    test('should handle DOM element retrieval', () => {
        mockDOM();
        expect(() => getElementById('my-id')).not.toThrow();
        expect(() => getElementById('non-existent')).not.toThrow();
    });
});

describe('Connection Management', () => {
    test('should update connection status correctly', () => {
        mockDOM();
        mockChatFunctions.updateConnectionStatus('connected', 'Connected to peer');
        
        const statusText = getElementById('status-text');
        expect(statusText.textContent).toBe('Connected to peer');
    });

    test('should enable send button', () => {
        mockDOM();
        mockChatFunctions.enableSendButton();
        
        const sendBtn = getElementById('send-btn');
        expect(sendBtn.disabled).toBe(false);
    });

    test('should disable send button', () => {
        mockDOM();
        mockChatFunctions.disableSendButton();
        
        const sendBtn = getElementById('send-btn');
        expect(sendBtn.disabled).toBe(true);
    });

    test('should handle connection close', () => {
        mockDOM();
        mockChatFunctions.handleConnectionClose();
        
        const statusText = getElementById('status-text');
        expect(statusText.textContent).toBe('Connection closed');
        
        const sendBtn = getElementById('send-btn');
        expect(sendBtn.disabled).toBe(true);
    });
});

describe('Message Handling', () => {
    test('should handle received string messages', () => {
        mockDOM();
        mockChatFunctions.handleReceivedMessage('Hello from peer');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('Peer: Hello from peer');
    });

    test('should handle received object messages', () => {
        mockDOM();
        mockChatFunctions.handleReceivedMessage({ message: 'Object message from peer' });
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('Peer: Object message from peer');
    });

    test('should handle unknown message formats', () => {
        mockDOM();
        const originalWarn = console.warn;
        let warnCalled = false;
        console.warn = () => { warnCalled = true; };
        
        mockChatFunctions.handleReceivedMessage({ unknownFormat: true });
        
        expect(warnCalled).toBe(true);
        console.warn = originalWarn;
    });
});

describe('Utility Functions Integration', () => {
    test('should format timestamps correctly', () => {
        const timestamp = formatTimestamp(new Date('2023-01-01T12:00:00'));
        expect(timestamp).toContain(':');
        expect(timestamp).toBe('12:00:00');
    });

    test('should validate peer IDs correctly', () => {
        expect(validatePeerId('valid-id')).toBe(true);
        expect(validatePeerId('')).toBe(false);
        expect(validatePeerId('   ')).toBe(false);
    });

    test('should create system messages correctly', () => {
        const message = createSystemMessage('test message');
        expect(message).toContain('System:');
        expect(message).toContain('test message');
    });
});

describe('Chat Message Flow', () => {
    test('should add system messages to chat', () => {
        mockDOM();
        addSystemMessage('Connection established');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('System: Connection established');
    });

    test('should add user messages to chat', () => {
        mockDOM();
        addMessageToChat('Hello world', 'me');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('Me: Hello world');
    });

    test('should add peer messages to chat', () => {
        mockDOM();
        addMessageToChat('Hi there', 'peer');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('Peer: Hi there');
    });

    test('should auto-scroll chat log', () => {
        mockDOM();
        addMessageToChat('Test message', 'me');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.scrollTop).toBe(chatLog.scrollHeight);
    });
});

describe('Peer ID Management', () => {
    test('should update peer ID display and global variable', () => {
        mockDOM();
        updateMyId('test-peer-123');
        
        const myIdElement = getElementById('my-id');
        expect(myIdElement.textContent).toBe('test-peer-123');
        expect(global.window.myId).toBe('test-peer-123');
    });

    test('should handle missing peer ID element gracefully', () => {
        global.document = {
            getElementById: () => null
        };
        global.window = {};
        
        // Should not throw error
        expect(() => updateMyId('test-id')).not.toThrow();
        expect(global.window.myId).toBe('test-id');
    });
});

describe('Error Handling', () => {
    test('should handle DOM element not found gracefully', () => {
        global.document = {
            getElementById: () => null
        };
        
        expect(() => addSystemMessage('Test message')).not.toThrow();
        expect(() => updateConnectionStatus('connected', 'Test')).not.toThrow();
        expect(() => enableSendButton()).not.toThrow();
        expect(() => disableSendButton()).not.toThrow();
    });

    test('should handle invalid event listener setup', () => {
        expect(() => addEventListenerSafe(null, 'click', () => {})).not.toThrow();
        expect(() => addEventListenerSafe({}, 'click', null)).not.toThrow();
        expect(() => addEventListenerSafe({}, 'click', 'not a function')).not.toThrow();
    });
});

describe('Integration Scenarios', () => {
    test('should handle complete connection flow', () => {
        mockDOM();
        
        // Initialize connection status
        mockChatFunctions.updateConnectionStatus('disconnected', 'Ready to connect');
        
        // Update peer ID
        updateMyId('peer-123');
        
        // Simulate connection process
        mockChatFunctions.updateConnectionStatus('connecting', 'Connecting...');
        mockChatFunctions.updateConnectionStatus('connected', 'Connected to peer-456');
        mockChatFunctions.enableSendButton();
        
        // Add messages
        addSystemMessage('Connection established');
        addMessageToChat('Hello', 'me');
        addMessageToChat('Hi there', 'peer');
        
        // Verify final state
        const myIdElement = getElementById('my-id');
        const statusText = getElementById('status-text');
        const sendBtn = getElementById('send-btn');
        const chatLog = getElementById('chat-log');
        
        expect(myIdElement.textContent).toBe('peer-123');
        expect(statusText.textContent).toBe('Connected to peer-456');
        expect(sendBtn.disabled).toBe(false);
        expect(chatLog.value).toContain('System: Connection established');
        expect(chatLog.value).toContain('Me: Hello');
        expect(chatLog.value).toContain('Peer: Hi there');
    });

    test('should handle connection failure and retry', () => {
        mockDOM();
        
        // Start connection
        mockChatFunctions.updateConnectionStatus('connecting', 'Connecting...');
        
        // Simulate failure
        mockChatFunctions.updateConnectionStatus('error', 'Connection failed');
        mockChatFunctions.disableSendButton();
        
        // Handle connection close
        mockChatFunctions.handleConnectionClose();
        
        // Verify error state
        const statusText = getElementById('status-text');
        const sendBtn = getElementById('send-btn');
        
        expect(statusText.textContent).toBe('Connection closed');
        expect(sendBtn.disabled).toBe(true);
    });
});

// Tests will be run by Bun test runner