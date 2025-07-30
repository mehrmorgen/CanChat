/**
 * DOM Manipulation Tests
 * Tests DOM helper functions and UI interactions
 * Uses Bun test runner with ESM imports
 */

import {
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

// Import jsdom for proper DOM testing
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

// Mock DOM with error-throwing getElementById
const mockDOMWithErrors = () => {
    global.document = {
        getElementById: (id) => {
            if (id === 'error-element') {
                throw new Error('Test DOM error');
            }
            return null;
        }
    };
};

describe('DOM Element Retrieval', () => {
    test('should return element when found', () => {
        mockDOM();
        const element = getElementById('my-id');
        expect(element).not.toBeNull();
        expect(element.textContent).toBe('Connecting...');
    });

    test('should return null when element not found', () => {
        mockDOM();
        const element = getElementById('non-existent');
        expect(element).toBeNull();
    });

    test('should handle DOM errors gracefully', () => {
        mockDOMWithErrors();
        const element = getElementById('error-element');
        expect(element).toBeNull();
    });

    test('should handle various element types', () => {
        mockDOM();
        
        const textElement = getElementById('my-id');
        const inputElement = getElementById('chat-log');
        const buttonElement = getElementById('send-btn');
        
        expect(textElement).not.toBeNull();
        expect(inputElement).not.toBeNull();
        expect(buttonElement).not.toBeNull();
    });
});

describe('Event Listener Management', () => {
    test('should add event listener to valid element', () => {
        mockDOM();
        const element = getElementById('connect-btn');
        const mockHandler = () => {};
        
        // Test that the function executes without throwing
        expect(() => addEventListenerSafe(element, 'click', mockHandler, { once: true })).not.toThrow();
        
        // Verify the element exists and is a proper DOM element
        expect(element).not.toBeNull();
        expect(typeof element.addEventListener).toBe('function');
    });

    test('should handle null element gracefully', () => {
        expect(() => addEventListenerSafe(null, 'click', () => {})).not.toThrow();
    });

    test('should handle null handler gracefully', () => {
        mockDOM();
        const element = getElementById('connect-btn');
        expect(() => addEventListenerSafe(element, 'click', null)).not.toThrow();
    });

    test('should handle non-function handler gracefully', () => {
        mockDOM();
        const element = getElementById('connect-btn');
        expect(() => addEventListenerSafe(element, 'click', 'not a function')).not.toThrow();
    });

    test('should handle element without addEventListener method', () => {
        const elementWithoutListener = { id: 'test' };
        expect(() => addEventListenerSafe(elementWithoutListener, 'click', () => {})).not.toThrow();
    });

    test('should handle various event types', () => {
        mockDOM();
        const element = getElementById('message-input');
        
        // Test that various event types can be added without throwing
        expect(() => addEventListenerSafe(element, 'keypress', () => {})).not.toThrow();
        expect(() => addEventListenerSafe(element, 'focus', () => {})).not.toThrow();
        expect(() => addEventListenerSafe(element, 'blur', () => {})).not.toThrow();
        
        // Verify the element is valid
        expect(element).not.toBeNull();
        expect(typeof element.addEventListener).toBe('function');
    });
});

describe('Peer ID Display Management', () => {
    test('should update peer ID element and global variable', () => {
        mockDOM();
        updateMyId('test-peer-id-123');
        
        const element = getElementById('my-id');
        expect(element.textContent).toBe('test-peer-id-123');
        expect(global.window.myId).toBe('test-peer-id-123');
    });

    test('should handle missing element gracefully', () => {
        global.document = {
            getElementById: () => null
        };
        global.window = {};
        
        expect(() => updateMyId('test-id')).not.toThrow();
        expect(global.window.myId).toBe('test-id');
    });

    test('should handle missing window object gracefully', () => {
        mockDOM();
        delete global.window;
        
        expect(() => updateMyId('test-id')).not.toThrow();
        
        // Restore window for other tests
        global.window = { myId: null };
    });

    test('should update with various peer ID formats', () => {
        mockDOM();
        
        const testIds = [
            'simple-id',
            'complex-peer-id-with-dashes',
            'peer_with_underscores',
            '123456789',
            'mixed-123_test'
        ];
        
        testIds.forEach(id => {
            updateMyId(id);
            const element = getElementById('my-id');
            expect(element.textContent).toBe(id);
            expect(global.window.myId).toBe(id);
        });
    });
});

describe('Chat Message DOM Manipulation', () => {
    test('should add message to chat log', () => {
        mockDOM();
        addMessageToChat('Hello world', 'me');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toBe('Me: Hello world\n');
        expect(chatLog.scrollTop).toBe(chatLog.scrollHeight);
    });

    test('should handle different sender types', () => {
        mockDOM();
        const chatLog = getElementById('chat-log');
        
        addMessageToChat('User message', 'me');
        addMessageToChat('Peer message', 'peer');
        addMessageToChat('System message', 'system');
        
        expect(chatLog.value).toContain('Me: User message');
        expect(chatLog.value).toContain('Peer: Peer message');
        expect(chatLog.value).toContain('System: System message');
    });

    test('should auto-scroll to bottom after adding message', () => {
        mockDOM();
        const chatLog = getElementById('chat-log');
        
        // Add message first
        addMessageToChat('Test message', 'me');
        
        // Test that scrollTop is set to scrollHeight (auto-scroll behavior)
        // In jsdom, scrollHeight is readonly, so we test that scrollTop equals scrollHeight
        expect(chatLog.scrollTop).toBe(chatLog.scrollHeight);
        
        // Verify the message was added
        expect(chatLog.value).toContain('Me: Test message');
    });

    test('should handle missing chat log element', () => {
        global.document = {
            getElementById: () => null
        };
        
        expect(() => addMessageToChat('Test message', 'me')).not.toThrow();
    });

    test('should preserve message order', () => {
        mockDOM();
        
        addMessageToChat('First message', 'me');
        addMessageToChat('Second message', 'peer');
        addMessageToChat('Third message', 'me');
        
        const chatLog = getElementById('chat-log');
        const lines = chatLog.value.split('\n').filter(line => line.trim());
        
        expect(lines[0]).toBe('Me: First message');
        expect(lines[1]).toBe('Peer: Second message');
        expect(lines[2]).toBe('Me: Third message');
    });
});

describe('System Message DOM Manipulation', () => {
    test('should add system message to chat', () => {
        mockDOM();
        addSystemMessage('Connection established');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toBe('System: Connection established\n');
    });

    test('should handle multiple system messages', () => {
        mockDOM();
        
        addSystemMessage('Initializing...');
        addSystemMessage('Connected to peer');
        addSystemMessage('Ready to chat');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toContain('System: Initializing...');
        expect(chatLog.value).toContain('System: Connected to peer');
        expect(chatLog.value).toContain('System: Ready to chat');
    });

    test('should handle empty system messages', () => {
        mockDOM();
        addSystemMessage('');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toBe('System: \n');
    });
});

describe('DOM State Management', () => {
    test('should maintain element state across operations', () => {
        mockDOM();
        
        // Update peer ID
        updateMyId('peer-123');
        
        // Add messages
        addMessageToChat('Hello', 'me');
        addSystemMessage('System ready');
        
        // Verify state persistence
        const myIdElement = getElementById('my-id');
        const chatLog = getElementById('chat-log');
        
        expect(myIdElement.textContent).toBe('peer-123');
        expect(chatLog.value).toContain('Me: Hello');
        expect(chatLog.value).toContain('System: System ready');
    });

    test('should handle rapid DOM updates', () => {
        mockDOM();
        
        // Rapid updates
        for (let i = 0; i < 10; i++) {
            updateMyId(`peer-${i}`);
            addMessageToChat(`Message ${i}`, 'me');
        }
        
        // Verify final state
        const myIdElement = getElementById('my-id');
        const chatLog = getElementById('chat-log');
        
        expect(myIdElement.textContent).toBe('peer-9');
        expect(chatLog.value).toContain('Message 9');
    });
});

describe('Error Recovery and Edge Cases', () => {
    test('should handle DOM manipulation with corrupted elements', () => {
        global.document = {
            getElementById: (id) => {
                if (id === 'chat-log') {
                    return {
                        set value(val) { throw new Error('DOM error'); },
                        get value() { return ''; }
                    };
                }
                return null;
            }
        };
        
        expect(() => addMessageToChat('Test', 'me')).not.toThrow();
    });

    test('should handle missing document object', () => {
        delete global.document;
        
        expect(() => getElementById('test')).not.toThrow();
        expect(getElementById('test')).toBeNull();
        
        // Restore document for other tests
        mockDOM();
    });

    test('should handle element property access errors', () => {
        global.document = {
            getElementById: () => ({
                get textContent() { throw new Error('Property access error'); },
                set textContent(val) { throw new Error('Property set error'); }
            })
        };
        
        expect(() => updateMyId('test')).not.toThrow();
    });
});

describe('DOM Integration Scenarios', () => {
    test('should handle complete UI interaction flow', () => {
        mockDOM();
        
        // Initialize UI state
        updateMyId('user-123');
        
        // Simulate chat interaction
        addSystemMessage('Chat initialized');
        addMessageToChat('Hello there', 'me');
        addMessageToChat('Hi back', 'peer');
        addSystemMessage('Connection stable');
        
        // Verify complete state
        const myIdElement = getElementById('my-id');
        const chatLog = getElementById('chat-log');
        
        expect(myIdElement.textContent).toBe('user-123');
        expect(global.window.myId).toBe('user-123');
        
        const messages = chatLog.value.split('\n').filter(line => line.trim());
        expect(messages).toHaveLength(4);
        expect(messages[0]).toBe('System: Chat initialized');
        expect(messages[1]).toBe('Me: Hello there');
        expect(messages[2]).toBe('Peer: Hi back');
        expect(messages[3]).toBe('System: Connection stable');
    });

    test('should handle UI cleanup and reset', () => {
        mockDOM();
        
        // Set up initial state
        updateMyId('temp-id');
        addMessageToChat('Temp message', 'me');
        
        // Reset state
        updateMyId('Connecting...');
        const chatLog = getElementById('chat-log');
        chatLog.value = '';
        
        // Verify reset
        const myIdElement = getElementById('my-id');
        expect(myIdElement.textContent).toBe('Connecting...');
        expect(chatLog.value).toBe('');
    });
});

// Tests will be run by Bun test runner