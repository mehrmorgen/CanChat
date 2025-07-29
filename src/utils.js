/**
 * Utility Functions Module
 * Contains helper functions for formatting, validation, DOM manipulation, and testing
 * Uses ESM export syntax for modern JavaScript module support
 */

// ===== TIMESTAMP AND FORMATTING UTILITIES =====

/**
 * Formats a timestamp for display in chat messages
 * @param {Date} date - The date to format
 * @returns {string} Formatted timestamp string
 */
export function formatTimestamp(date = new Date()) {
    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// ===== PEER ID VALIDATION UTILITIES =====

/**
 * Validates a peer ID input to ensure it's not empty or whitespace-only
 * @param {string} peerId - The peer ID to validate
 * @returns {boolean} True if valid, false if empty or whitespace-only
 */
export function validatePeerId(peerId) {
    return Boolean(peerId?.trim());
}

// ===== MESSAGE CREATION UTILITIES =====

/**
 * Creates a system message with proper formatting
 * @param {string} text - The message text
 * @returns {string} Formatted system message
 */
export function createSystemMessage(text) {
    return `System: ${text}`;
}

/**
 * Creates a user message with proper formatting
 * @param {string} text - The message text
 * @param {string} sender - The sender type ('me', 'peer', 'system')
 * @returns {string} Formatted message
 */
export function createMessage(text, sender = 'me') {
    const prefixes = new Map([
        ['me', 'Me:'],
        ['peer', 'Peer:'],
        ['peer-relay', 'Peer (Relay):'],
        ['system', 'System:']
    ]);
    
    const prefix = prefixes.get(sender) ?? 'Unknown:';
    return `${prefix} ${text}`;
}

// ===== DOM HELPER FUNCTIONS =====

/**
 * Safe getElementById wrapper with error handling
 * @param {string} id - The element ID to find
 * @returns {HTMLElement|null} The element or null if not found
 */
export function getElementById(id) {
    try {
        return document.getElementById(id);
    } catch (error) {
        console.error(`Error finding element with ID "${id}":`, error);
        return null;
    }
}

/**
 * Safe addEventListener wrapper with error handling
 * @param {HTMLElement} element - The element to add listener to
 * @param {string} event - The event type
 * @param {Function} handler - The event handler function
 * @param {Object} options - Event listener options
 */
export function addEventListenerSafe(element, event, handler, options = {}) {
    if (!element || typeof handler !== 'function') {
        console.error('Invalid element or handler for addEventListener');
        return;
    }
    
    try {
        element.addEventListener(event, handler, options);
    } catch (error) {
        console.error(`Error adding event listener for "${event}":`, error);
    }
}

/**
 * Updates the displayed peer ID and stores it globally
 * @param {string} id - The peer ID to display and store
 */
export function updateMyId(id) {
    const myIdElement = getElementById('my-id');
    if (myIdElement) {
        myIdElement.textContent = id;
    }
    
    // Store globally for compatibility
    if (typeof window !== 'undefined') {
        window.myId = id;
    }
}

/**
 * Adds a formatted message to the chat log with appropriate prefix
 * @param {string} message - The message text to add
 * @param {string} sender - The sender type ('me', 'peer', 'system')
 */
export function addMessageToChat(message, sender) {
    const chatLog = getElementById('chat-log');
    if (!chatLog) {
        console.error('Chat log element not found');
        return;
    }

    const formattedMessage = createMessage(message, sender);
    chatLog.value += formattedMessage + '\n';
    chatLog.scrollTop = chatLog.scrollHeight;
}

/**
 * Adds a system message to the chat log
 * @param {string} message - The system message to add
 */
export function addSystemMessage(message) {
    addMessageToChat(message, 'system');
}

// ===== TEST FRAMEWORK SETUP AND UTILITIES =====

/**
 * Simple test framework for Bun test runner compatibility
 * Provides Jest-like API for testing
 */

let testResults = [];
let asyncTestsCompleted = 0;
let totalAsyncTests = 0;

/**
 * Test suite grouping function
 * @param {string} description - Description of the test suite
 * @param {Function} testSuite - Function containing the tests
 */
export function describe(description, testSuite) {
    console.log(`\n=== ${description} ===`);
    testSuite();
}

/**
 * Individual test function
 * @param {string} description - Description of the test
 * @param {Function} testFunction - Function containing the test logic
 */
export function test(description, testFunction) {
    try {
        testFunction();
        testResults.push({ description, status: 'PASS', error: null });
        console.log(`✓ ${description}`);
    } catch (error) {
        testResults.push({ description, status: 'FAIL', error: error.message });
        console.log(`✗ ${description}: ${error.message}`);
    }
}

/**
 * Asynchronous test function with timeout
 * @param {string} description - Description of the test
 * @param {Function} testFunction - Function containing the test logic
 * @param {number} timeout - Timeout in milliseconds
 */
export function asyncTest(description, testFunction, timeout = 5000) {
    totalAsyncTests++;
    setTimeout(() => {
        try {
            testFunction();
            testResults.push({ description, status: 'PASS', error: null });
            console.log(`✓ ${description}`);
        } catch (error) {
            testResults.push({ description, status: 'FAIL', error: error.message });
            console.log(`✗ ${description}: ${error.message}`);
        }
        asyncTestsCompleted++;
        if (asyncTestsCompleted === totalAsyncTests) {
            displayTestResults();
        }
    }, timeout);
}

/**
 * Expectation function for assertions
 * @param {any} actual - The actual value to test
 * @returns {Object} Object with assertion methods
 */
export function expect(actual) {
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
            toBeNull: () => {
                if (actual === null) {
                    throw new Error(`Expected not null, but got null`);
                }
            }
        },
        toBeTruthy: () => {
            if (!actual) {
                throw new Error(`Expected truthy value, but got ${actual}`);
            }
        },
        toContain: (expected) => {
            if (!actual.includes(expected)) {
                throw new Error(`Expected "${actual}" to contain "${expected}"`);
            }
        },
        toBeGreaterThan: (expected) => {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },
        toBeGreaterThanOrEqual: (expected) => {
            if (actual < expected) {
                throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
            }
        },
        toBeLessThan: (expected) => {
            if (actual >= expected) {
                throw new Error(`Expected ${actual} to be less than ${expected}`);
            }
        }
    };
}

/**
 * Displays test results in the DOM
 */
export function displayTestResults() {
    const testOutput = getElementById('test-output');
    if (!testOutput) return;

    const passedTests = testResults.filter(test => test.status === 'PASS');
    const failedTests = testResults.filter(test => test.status === 'FAIL');

    let html = `
        <h4>Test Summary</h4>
        <p>Total: ${testResults.length} | 
           <span class="test-pass">Passed: ${passedTests.length}</span> | 
           <span class="test-fail">Failed: ${failedTests.length}</span></p>
    `;

    if (failedTests.length > 0) {
        html += '<h4>Failed Tests:</h4>';
        failedTests.forEach(test => {
            html += `<div class="test-fail">✗ ${test.description}: ${test.error}</div>`;
        });
    }

    testOutput.innerHTML = html;
}

/**
 * Sets up the test framework and initializes test results
 */
export function setupTestFramework() {
    testResults = [];
    asyncTestsCompleted = 0;
    totalAsyncTests = 0;
    
    // Initialize test output element if it exists
    const testOutput = getElementById('test-output');
    if (testOutput) {
        testOutput.innerHTML = '<p>Initializing tests...</p>';
    }
    
    console.log('Test framework initialized');
}

/**
 * Runs all tests and displays results
 */
export function runTests() {
    console.log('Running test suite...');
    setupTestFramework();
    
    // If there are no async tests, display results immediately
    if (totalAsyncTests === 0) {
        displayTestResults();
    }
}

// ===== UTILITY EXPORTS FOR COMPATIBILITY =====

/**
 * Gets the current test results
 * @returns {Array} Array of test result objects
 */
export function getTestResults() {
    return [...testResults];
}

/**
 * Clears all test results
 */
export function clearTestResults() {
    testResults = [];
    asyncTestsCompleted = 0;
    totalAsyncTests = 0;
}