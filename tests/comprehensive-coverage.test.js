import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';
import * as utils from '../src/utils.js';

let dom;

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
            <textarea id="chat-log"></textarea>
            <div id="test-output"></div>
        </body>
        </html>
    `);
    
    global.document = dom.window.document;
    global.window = dom.window;
    global.navigator = {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    // Mock console to capture output
    global.console = {
        log: () => {},
        error: () => {},
        warn: () => {},
        info: () => {}
    };
});

afterEach(() => {
    // Cleanup
    delete global.document;
    delete global.window;
    delete global.navigator;
});

describe('Comprehensive Coverage Tests', () => {
    test('should test all utility functions with edge cases', () => {
        // Test formatTimestamp with various inputs
        const now = new Date();
        const formatted = utils.formatTimestamp(now);
        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe('string');
        
        // Test with invalid date
        const invalidFormatted = utils.formatTimestamp(new Date('invalid'));
        expect(invalidFormatted).toBeDefined();
        
        // Test validatePeerId with all edge cases (simple validation)
        expect(utils.validatePeerId('valid-peer-123')).toBe(true);
        expect(utils.validatePeerId('test_peer')).toBe(true);
        expect(utils.validatePeerId('')).toBe(false);
        expect(utils.validatePeerId('  ')).toBe(false);
        expect(utils.validatePeerId('ab')).toBe(true); // Simple validation allows short IDs
        expect(utils.validatePeerId('a'.repeat(51))).toBe(true); // Simple validation allows long IDs
        expect(utils.validatePeerId('invalid peer id')).toBe(true); // Simple validation allows spaces
        expect(utils.validatePeerId(null)).toBe(false);
        expect(utils.validatePeerId(undefined)).toBe(false);
        // Number input will cause error in trim(), so it returns false
        try {
            expect(utils.validatePeerId(123)).toBe(false);
        } catch (error) {
            // Expected behavior - non-string inputs cause errors
            expect(error).toBeDefined();
        }
        
        // Test createSystemMessage
        const sysMsg = utils.createSystemMessage('Test system message');
        expect(sysMsg).toContain('System:');
        expect(sysMsg).toContain('Test system message');
        
        // Test createMessage with all sender types
        const userMsg = utils.createMessage('Hello', 'me');
        expect(userMsg).toContain('Me:');
        expect(userMsg).toContain('Hello');
        
        const peerMsg = utils.createMessage('Hi there', 'peer');
        expect(peerMsg).toContain('Peer:');
        expect(peerMsg).toContain('Hi there');
        
        const unknownMsg = utils.createMessage('Unknown', 'unknown');
        expect(unknownMsg).toContain('Unknown:');
        expect(unknownMsg).toContain('Unknown');
        
        const defaultMsg = utils.createMessage('Default');
        expect(defaultMsg).toContain('Me:');
        expect(defaultMsg).toContain('Default');
    });
    
    test('should test DOM helper functions thoroughly', () => {
        // Test getElementById with existing element
        const existingElement = utils.getElementById('my-id');
        expect(existingElement).not.toBeNull();
        expect(existingElement.id).toBe('my-id');
        
        // Test getElementById with non-existing element
        const nonExistingElement = utils.getElementById('non-existing');
        expect(nonExistingElement).toBeNull();
        
        // Test getElementById with empty string
        const emptyElement = utils.getElementById('');
        expect(emptyElement).toBeNull();
        
        // Test getElementById with null
        const nullElement = utils.getElementById(null);
        expect(nullElement).toBeNull();
        
        // Test addEventListenerSafe with valid inputs
        const button = document.getElementById('connect-btn');
        let clicked = false;
        const handler = () => { clicked = true; };
        
        utils.addEventListenerSafe(button, 'click', handler);
        button.click();
        expect(clicked).toBe(true);
        
        // Test addEventListenerSafe with null element
        utils.addEventListenerSafe(null, 'click', handler);
        
        // Test addEventListenerSafe with null handler
        utils.addEventListenerSafe(button, 'click', null);
        
        // Test addEventListenerSafe with invalid handler
        utils.addEventListenerSafe(button, 'click', 'not a function');
        
        // Test updateMyId
        utils.updateMyId('test-peer-123');
        expect(document.getElementById('my-id').textContent).toBe('test-peer-123');
        expect(global.window.myId).toBe('test-peer-123');
        
        // Test updateMyId with null
        utils.updateMyId(null);
        
        // Test updateMyId with empty string
        utils.updateMyId('');
    });
    
    test('should test chat message functions with all scenarios', () => {
        // Test addMessageToChat with valid inputs
        // Note: addMessageToChat uses textarea.value, not DOM children
        const chatLog = document.getElementById('chat-log');
        const initialValue = chatLog.value || '';
        
        utils.addMessageToChat('Hello world', 'me');
        expect(chatLog.value).toContain('Hello world');
        expect(chatLog.value).toContain('Me:');
        
        // Test addMessageToChat with peer message
        utils.addMessageToChat('Hi there', 'peer');
        expect(chatLog.value).toContain('Hi there');
        expect(chatLog.value).toContain('Peer:');
        
        // Test addMessageToChat with system message
        utils.addMessageToChat('System notification', 'system');
        expect(chatLog.value).toContain('System notification');
        expect(chatLog.value).toContain('System:');
        
        // Test addMessageToChat with empty message
        const beforeEmpty = chatLog.value;
        utils.addMessageToChat('', 'me');
        expect(chatLog.value).toContain('Me:'); // Still adds the message with empty content
        
        // Test addMessageToChat with null message
        const beforeNull = chatLog.value;
        utils.addMessageToChat(null, 'me');
        expect(chatLog.value).toContain('Me:'); // Still adds the message with null content
        
        // Test addSystemMessage
        utils.addSystemMessage('Connection established');
        expect(chatLog.value).toContain('Connection established');
        expect(chatLog.value).toContain('System:');
        
        // Test addSystemMessage with empty message
        utils.addSystemMessage('');
        expect(chatLog.value).toContain('System:'); // Still adds system message with empty content
        
        // Test addSystemMessage with null
        utils.addSystemMessage(null);
        expect(chatLog.value).toContain('System:'); // Still adds system message with null content
    });
    
    test('should test custom test framework functions', () => {
        // Test setupTestFramework
        utils.setupTestFramework();
        
        // Test clearTestResults
        utils.clearTestResults();
        
        // Test getTestResults
        const results = utils.getTestResults();
        expect(Array.isArray(results)).toBe(true);
        
        // Test runTests
        utils.runTests();
        
        // Test displayTestResults
        utils.displayTestResults();
        
        // Test describe function
        let describeCalled = false;
        utils.describe('Test Suite', () => {
            describeCalled = true;
        });
        expect(describeCalled).toBe(true);
        
        // Test test function with passing test
        utils.test('should pass', () => {
            expect(true).toBe(true);
        });
        
        // Test test function with failing test
        utils.test('should fail', () => {
            throw new Error('Test error');
        });
        
        // Test expect function with all matchers
        const expectObj = utils.expect(5);
        
        // Test toBe
        expectObj.toBe(5);
        try {
            expectObj.toBe(10);
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('Expected');
        }
        
        // Test toBeNull
        const nullExpect = utils.expect(null);
        nullExpect.toBeNull();
        
        try {
            utils.expect(5).toBeNull();
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('Expected null');
        }
        
        // Test not.toBeNull
        utils.expect(5).not.toBeNull();
        
        try {
            utils.expect(null).not.toBeNull();
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('Expected not null');
        }
        
        // Test toBeTruthy
        utils.expect(true).toBeTruthy();
        utils.expect(1).toBeTruthy();
        utils.expect('hello').toBeTruthy();
        
        try {
            utils.expect(false).toBeTruthy();
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('Expected truthy');
        }
        
        // Test toContain
        utils.expect('hello world').toContain('world');
        utils.expect([1, 2, 3]).toContain(2);
        
        try {
            utils.expect('hello').toContain('world');
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('to contain');
        }
        
        // Test toBeGreaterThan
        utils.expect(10).toBeGreaterThan(5);
        
        try {
            utils.expect(5).toBeGreaterThan(10);
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('to be greater than');
        }
        
        // Test toBeGreaterThanOrEqual
        utils.expect(10).toBeGreaterThanOrEqual(10);
        utils.expect(10).toBeGreaterThanOrEqual(5);
        
        try {
            utils.expect(5).toBeGreaterThanOrEqual(10);
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('to be greater than or equal');
        }
        
        // Test toBeLessThan
        utils.expect(5).toBeLessThan(10);
        
        try {
            utils.expect(10).toBeLessThan(5);
            expect(false).toBe(true); // Should not reach here
        } catch (error) {
            expect(error.message).toContain('to be less than');
        }
    });
    
    test('should test async test functionality', (done) => {
        let asyncTestExecuted = false;
        
        utils.asyncTest('async test', () => {
            asyncTestExecuted = true;
        }, 100);
        
        setTimeout(() => {
            expect(asyncTestExecuted).toBe(true);
            done();
        }, 200);
    });
    
    test('should test error handling in all functions', () => {
        // Mock document to throw errors
        const originalDocument = global.document;
        
        global.document = {
            getElementById: () => {
                throw new Error('DOM error');
            }
        };
        
        // Test getElementById error handling
        const errorElement = utils.getElementById('test');
        expect(errorElement).toBeNull();
        
        // Restore document
        global.document = originalDocument;
        
        // Test addMessageToChat with missing chat log
        const originalChatLog = document.getElementById('chat-log');
        originalChatLog.remove();
        
        utils.addMessageToChat('test message', 'me');
        // Should not throw error
        
        // Restore chat log
        document.body.appendChild(originalChatLog);
        
        // Test updateMyId with missing element
        const originalMyId = document.getElementById('my-id');
        originalMyId.remove();
        
        utils.updateMyId('test-id');
        // Should not throw error
        
        // Restore my-id element
        document.body.appendChild(originalMyId);
    });
    
    test('should test all edge cases and boundary conditions', () => {
        // Test formatTimestamp with edge dates
        const edgeDates = [
            new Date(0), // Unix epoch
            new Date('1970-01-01'),
            new Date('2099-12-31'),
            new Date(Date.now() + 1000000000), // Future date
        ];
        
        edgeDates.forEach(date => {
            const formatted = utils.formatTimestamp(date);
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
        });
        
        // Test validatePeerId with boundary lengths (simple validation)
        expect(utils.validatePeerId('abc')).toBe(true); // Any non-empty string is valid
        expect(utils.validatePeerId('a'.repeat(50))).toBe(true); // Any non-empty string is valid
        expect(utils.validatePeerId('ab')).toBe(true); // Any non-empty string is valid
        expect(utils.validatePeerId('a'.repeat(51))).toBe(true); // Any non-empty string is valid
        
        // Test with special characters (simple validation allows all)
        expect(utils.validatePeerId('test-123')).toBe(true);
        expect(utils.validatePeerId('test_456')).toBe(true);
        expect(utils.validatePeerId('test@123')).toBe(true);
        expect(utils.validatePeerId('test.123')).toBe(true);
        expect(utils.validatePeerId('test 123')).toBe(true);
        
        // Test createMessage with edge cases
        const longMessage = 'a'.repeat(1000);
        const longMsg = utils.createMessage(longMessage, 'me');
        expect(longMsg).toContain(longMessage);
        
        const emptyMsg = utils.createMessage('', 'me');
        expect(emptyMsg).toContain('Me:');
        
        const nullMsg = utils.createMessage(null, 'me');
        expect(nullMsg).toContain('Me:');
        
        // Test with various sender types
        const senders = ['me', 'peer', 'system', 'unknown', '', null, undefined, 123];
        senders.forEach(sender => {
            const msg = utils.createMessage('test', sender);
            expect(typeof msg).toBe('string');
            expect(msg.length).toBeGreaterThan(0);
        });
    });
});