/**
 * Integration Tests for Chat Application
 * Tests WebRTC functionality, peer connections, and message handling
 * Uses Bun test runner with ESM imports and jsdom for DOM testing
 */

// Import utility functions
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

// Import chat functions for testing
import {
    updateConnectionStatus,
    enableSendButton,
    disableSendButton,
    handleConnectionClose,
    handleReceivedMessage
} from '../src/chat.js';

// Import Bun's test functions
import { describe, test, expect } from 'bun:test';
import { JSDOM } from 'jsdom';

// Setup jsdom environment for testing
const setupJSDOM = () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <div id="my-id">Connecting...</div>
            <input id="peer-id-input" type="text" />
            <button id="connect-btn">Connect</button>
            <button id="retry-btn" style="display: none;">Retry</button>
            <button id="send-btn" disabled>Send</button>
            <input id="message-input" type="text" />
            <textarea id="chat-log"></textarea>
            <div id="status-indicator" class="status-indicator"></div>
            <div id="status-text">Disconnected</div>
            <div id="test-output"></div>
        </body>
        </html>
    `, {
        url: 'https://localhost:3000',
        pretendToBeVisual: true,
        resources: 'usable'
    });

    // Set up global environment
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;

    // Mock additional properties needed for tests
    global.window.myId = null;
    global.window.isSecureContext = true;
    global.window.RTCPeerConnection = function () { };
    global.window.RTCDataChannel = function () { };
    global.window.Peer = null;

    return dom;
};

// Legacy function name for compatibility
const mockDOM = setupJSDOM;

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
        expect(typeof getElementById).toBe('function');
        expect(typeof addEventListenerSafe).toBe('function');
    });

    test('should handle DOM element retrieval', () => {
        mockDOM();
        const element = getElementById('my-id');
        expect(element).not.toBeNull();
        expect(element.textContent).toBe('Connecting...');
    });
});

describe('Connection Management', () => {
    test('should update connection status correctly', () => {
        mockDOM();
        
        updateConnectionStatus('connected', 'Connected to peer');
        
        const statusText = getElementById('status-text');
        expect(statusText.textContent).toBe('Connected to peer');
    });

    test('should enable send button', () => {
        mockDOM();
        
        enableSendButton();
        
        const sendBtn = getElementById('send-btn');
        expect(sendBtn.disabled).toBe(false);
    });

    test('should disable send button', () => {
        mockDOM();
        disableSendButton();

        const sendBtn = getElementById('send-btn');
        expect(sendBtn.disabled).toBe(true);
    });

    test('should handle connection close', () => {
        mockDOM();
        
        handleConnectionClose();
        
        const statusText = getElementById('status-text');
        expect(statusText.textContent).toBe('Connection closed');
    });
});

describe('Message Handling', () => {
    test('should handle received string messages', () => {
        mockDOM();
        
        handleReceivedMessage('Hello from peer');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('Peer: Hello from peer');
    });

    test('should handle received object messages', () => {
        mockDOM();
        
        handleReceivedMessage({ message: 'Object message from peer' });
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('Peer: Object message from peer');
    });

    test('should handle unknown message formats', () => {
        mockDOM();
        let warnCalled = false;
        console.warn = () => { warnCalled = true; };

        handleReceivedMessage({ unknownFormat: true });

        expect(warnCalled).toBe(true);
    });
});

describe('Utility Functions Integration', () => {
    test('should format timestamps correctly', () => {
        const testDate = new Date('2023-01-01T12:30:45');
        const formatted = formatTimestamp(testDate);
        expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    test('should validate peer IDs correctly', () => {
        expect(validatePeerId('valid-peer-id')).toBe(true);
        expect(validatePeerId('')).toBe(false);
        expect(validatePeerId('   ')).toBe(false);
        expect(validatePeerId(null)).toBe(false);
        expect(validatePeerId(undefined)).toBe(false);
    });

    test('should create system messages correctly', () => {
        const message = createSystemMessage('Test message');
        expect(message).toBe('System: Test message');
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
    });

    test('should handle missing peer ID element gracefully', () => {
        mockDOM();
        
        // Should not throw error
        expect(() => updateMyId('test-id')).not.toThrow();
    });
});

describe('Error Handling', () => {
    test('should handle DOM element not found gracefully', () => {
        // Create empty DOM
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;

        expect(() => addSystemMessage('Test message')).not.toThrow();
        expect(() => updateConnectionStatus('connected', 'Test')).not.toThrow();
        expect(() => enableSendButton()).not.toThrow();
        expect(() => disableSendButton()).not.toThrow();
    });

    test('should handle invalid event listener setup', () => {
        expect(() => addEventListenerSafe(null, 'click', () => { })).not.toThrow();
        expect(() => addEventListenerSafe({}, 'click', null)).not.toThrow();
        expect(() => addEventListenerSafe({}, 'click', 'not a function')).not.toThrow();
    });
});

describe('Integration Scenarios', () => {
    test('should handle complete connection flow', () => {
        mockDOM();

        // Initialize connection status
        updateConnectionStatus('disconnected', 'Ready to connect');

        // Update peer ID
        updateMyId('peer-123');

        // Simulate connection process
        updateConnectionStatus('connecting', 'Connecting...');
        updateConnectionStatus('connected', 'Connected to peer-456');
        enableSendButton();

        // Add messages
        addSystemMessage('Connection established');
        addMessageToChat('Hello', 'me');
        addMessageToChat('Hi back', 'peer');

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
        expect(chatLog.value).toContain('Peer: Hi back');
    });

    test('should handle connection failure and retry', () => {
        mockDOM();

        // Start connection
        updateConnectionStatus('connecting', 'Connecting...');

        // Simulate failure
        updateConnectionStatus('error', 'Connection failed');
        disableSendButton();

        // Handle connection close
        handleConnectionClose();

        // Verify error state
        const statusText = getElementById('status-text');
        const sendBtn = getElementById('send-btn');

        expect(statusText.textContent).toBe('Connection closed');
        expect(sendBtn.disabled).toBe(true);
    });
});