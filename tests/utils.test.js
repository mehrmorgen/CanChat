/**
 * Unit Tests for Utility Functions
 * Tests all utility functions using Bun test runner with ESM imports
 * Falls back to custom test framework when Bun is not available
 */

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
    runTests,
    getTestResults,
    clearTestResults,
    describe as utilDescribe,
    test as utilTest,
    expect as utilExpect
} from '../src/utils.js';

// Use Bun's test functions when available, fallback to our own
const describe = typeof globalThis.describe !== 'undefined' ? globalThis.describe : utilDescribe;
const test = typeof globalThis.test !== 'undefined' ? globalThis.test : utilTest;

// Enhanced expect function that works with both Bun and our framework
const expect = (actual) => {
    // If Bun's expect is available, use it
    if (typeof globalThis.expect !== 'undefined') {
        return globalThis.expect(actual);
    }
    
    // Otherwise use our custom implementation
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`Expected ${expected}, but got ${actual}`);
            }
        },
        toBeNull: () => {
            if (actual !== null) {
                throw new Error(`Expected null, but got ${actual}`);
            }
        },
        not: {
            toBe: (expected) => {
                if (actual === expected) {
                    throw new Error(`Expected not ${expected}, but got ${actual}`);
                }
            },
            toBeNull: () => {
                if (actual === null) {
                    throw new Error(`Expected not null, but got null`);
                }
            }
        },
        toMatch: (pattern) => {
            if (!pattern.test(actual)) {
                throw new Error(`Expected "${actual}" to match pattern ${pattern}`);
            }
        },
        toContain: (expected) => {
            if (!actual.includes(expected)) {
                throw new Error(`Expected "${actual}" to contain "${expected}"`);
            }
        },
        toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
            }
        }
    };
};

// Mock DOM environment for testing
const mockDOM = () => {
    global.document = {
        getElementById: (id) => {
            const mockElements = {
                'my-id': {
                    textContent: 'Connecting...',
                    set textContent(value) { this._textContent = value; },
                    get textContent() { return this._textContent || 'Connecting...'; }
                },
                'chat-log': {
                    value: '',
                    scrollTop: 0,
                    scrollHeight: 100,
                    set scrollTop(value) { this._scrollTop = value; },
                    get scrollTop() { return this._scrollTop || 0; }
                },
                'test-output': {
                    innerHTML: '',
                    set innerHTML(value) { this._innerHTML = value; },
                    get innerHTML() { return this._innerHTML || ''; }
                }
            };
            return mockElements[id] || null;
        }
    };
    
    global.window = {
        myId: null
    };
    
    global.console = {
        log: () => {},
        error: () => {},
        group: () => {},
        groupEnd: () => {}
    };
};

// Setup beforeEach equivalent
const beforeEach = (fn) => {
    // For our simple test framework, we'll call this manually in each test
    return fn;
};

describe('Timestamp Formatting', () => {
    test('formatTimestamp should format current date correctly', () => {
        const result = formatTimestamp();
        expect(typeof result).toBe('string');
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('formatTimestamp should format specific date correctly', () => {
        const testDate = new Date('2024-01-01T12:30:45');
        const result = formatTimestamp(testDate);
        expect(result).toBe('12:30:45');
    });

    test('formatTimestamp should handle edge cases', () => {
        const testDate = new Date('2024-01-01T00:00:00');
        const result = formatTimestamp(testDate);
        expect(result).toBe('00:00:00');
    });
});

describe('Peer ID Validation', () => {
    test('validatePeerId should return true for valid peer IDs', () => {
        expect(validatePeerId('valid-peer-id')).toBe(true);
        expect(validatePeerId('123456')).toBe(true);
        expect(validatePeerId('peer_id_with_underscores')).toBe(true);
    });

    test('validatePeerId should return false for invalid peer IDs', () => {
        expect(validatePeerId('')).toBe(false);
        expect(validatePeerId('   ')).toBe(false);
        expect(validatePeerId(null)).toBe(false);
        expect(validatePeerId(undefined)).toBe(false);
    });

    test('validatePeerId should handle whitespace correctly', () => {
        expect(validatePeerId('  valid-id  ')).toBe(true);
        expect(validatePeerId('\t\n')).toBe(false);
    });
});

describe('Message Creation', () => {
    test('createSystemMessage should format system messages correctly', () => {
        const result = createSystemMessage('Test message');
        expect(result).toBe('System: Test message');
    });

    test('createMessage should format messages with different senders', () => {
        expect(createMessage('Hello', 'me')).toBe('Me: Hello');
        expect(createMessage('Hi there', 'peer')).toBe('Peer: Hi there');
        expect(createMessage('System info', 'system')).toBe('System: System info');
        expect(createMessage('Relay message', 'peer-relay')).toBe('Peer (Relay): Relay message');
    });

    test('createMessage should handle unknown senders', () => {
        const result = createMessage('Test', 'unknown');
        expect(result).toBe('Unknown: Test');
    });

    test('createMessage should default to "me" sender', () => {
        const result = createMessage('Default sender test');
        expect(result).toBe('Me: Default sender test');
    });
});

describe('DOM Helper Functions', () => {
    test('getElementById should return element when found', () => {
        mockDOM();
        const element = getElementById('my-id');
        expect(element).not.toBeNull();
        expect(element.textContent).toBe('Connecting...');
    });

    test('getElementById should return null when element not found', () => {
        mockDOM();
        const element = getElementById('non-existent');
        expect(element).toBeNull();
    });

    test('getElementById should handle errors gracefully', () => {
        // Mock document.getElementById to throw an error
        global.document = {
            getElementById: () => {
                throw new Error('Test error');
            }
        };
        
        const element = getElementById('test');
        expect(element).toBeNull();
    });

    test('addEventListenerSafe should handle valid inputs', () => {
        const mockElement = {
            addEventListener: (event, handler, options) => {
                mockElement._event = event;
                mockElement._handler = handler;
                mockElement._options = options;
            }
        };
        
        const mockHandler = () => {};
        addEventListenerSafe(mockElement, 'click', mockHandler, { once: true });
        
        expect(mockElement._event).toBe('click');
        expect(mockElement._handler).toBe(mockHandler);
        expect(mockElement._options).toEqual({ once: true });
    });

    test('addEventListenerSafe should handle invalid inputs', () => {
        // Should not throw errors with invalid inputs
        addEventListenerSafe(null, 'click', () => {});
        addEventListenerSafe({}, 'click', null);
        addEventListenerSafe({}, 'click', 'not a function');
    });

    test('updateMyId should update element and global variable', () => {
        mockDOM();
        updateMyId('test-peer-id');
        
        const element = getElementById('my-id');
        expect(element.textContent).toBe('test-peer-id');
        expect(global.window.myId).toBe('test-peer-id');
    });

    test('updateMyId should handle missing element gracefully', () => {
        global.document = {
            getElementById: () => null
        };
        global.window = {};
        
        // Should not throw error
        updateMyId('test-id');
        expect(global.window.myId).toBe('test-id');
    });
});

describe('Chat Message Functions', () => {
    test('addMessageToChat should add message to chat log', () => {
        mockDOM();
        addMessageToChat('Hello world', 'me');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toBe('Me: Hello world\n');
        expect(chatLog.scrollTop).toBe(chatLog.scrollHeight);
    });

    test('addMessageToChat should handle different sender types', () => {
        mockDOM();
        const chatLog = getElementById('chat-log');
        
        addMessageToChat('User message', 'me');
        addMessageToChat('Peer message', 'peer');
        addMessageToChat('System message', 'system');
        
        expect(chatLog.value).toContain('Me: User message');
        expect(chatLog.value).toContain('Peer: Peer message');
        expect(chatLog.value).toContain('System: System message');
    });

    test('addMessageToChat should handle missing chat log element', () => {
        global.document = {
            getElementById: () => null
        };
        
        // Should not throw error
        addMessageToChat('Test message', 'me');
    });

    test('addSystemMessage should add system message', () => {
        mockDOM();
        addSystemMessage('System notification');
        
        const chatLog = getElementById('chat-log');
        expect(chatLog.value).toBe('System: System notification\n');
    });
});

describe('Test Framework Functions', () => {
    test('setupTestFramework should initialize test state', () => {
        mockDOM();
        clearTestResults();
        setupTestFramework();
        
        const results = getTestResults();
        expect(results.length).toBe(0);
    });

    test('clearTestResults should reset test state', () => {
        clearTestResults();
        const results = getTestResults();
        expect(results.length).toBe(0);
    });

    test('getTestResults should return copy of results', () => {
        clearTestResults();
        const results1 = getTestResults();
        const results2 = getTestResults();
        
        expect(results1).not.toBe(results2); // Different objects
        expect(results1).toEqual(results2); // Same content
    });

    test('runTests should execute without errors', () => {
        mockDOM();
        // Should not throw any errors
        runTests();
    });
});

describe('Edge Cases and Error Handling', () => {
    test('functions should handle undefined/null inputs gracefully', () => {
        expect(validatePeerId(null)).toBe(false);
        expect(validatePeerId(undefined)).toBe(false);
        
        expect(createSystemMessage('')).toBe('System: ');
        expect(createMessage('', null)).toBe('Me: ');
    });

    test('formatTimestamp should handle invalid dates', () => {
        const invalidDate = new Date('invalid');
        const result = formatTimestamp(invalidDate);
        expect(typeof result).toBe('string');
    });

    test('DOM functions should work without global window', () => {
        const originalWindow = global.window;
        delete global.window;
        
        updateMyId('test-id');
        
        global.window = originalWindow || {};
    });
});

describe('Integration Tests', () => {
    test('complete message flow should work correctly', () => {
        mockDOM();
        clearTestResults();
        
        // Update peer ID
        updateMyId('peer-123');
        
        // Add various message types
        addSystemMessage('Connection established');
        addMessageToChat('Hello', 'me');
        addMessageToChat('Hi there', 'peer');
        
        // Verify state
        const myIdElement = getElementById('my-id');
        const chatLog = getElementById('chat-log');
        
        expect(myIdElement.textContent).toBe('peer-123');
        expect(global.window.myId).toBe('peer-123');
        expect(chatLog.value).toContain('System: Connection established');
        expect(chatLog.value).toContain('Me: Hello');
        expect(chatLog.value).toContain('Peer: Hi there');
    });

    test('test framework integration should work', () => {
        mockDOM();
        setupTestFramework();
        
        // Simulate running tests
        runTests();
        
        // Should not throw errors and should initialize properly
        const results = getTestResults();
        expect(Array.isArray(results)).toBe(true);
    });
});

// If running directly (not with Bun), run the tests
if (typeof globalThis.test === 'undefined') {
    console.log('Running tests with custom framework...');
    // The tests will run automatically when the describe/test functions are called
}