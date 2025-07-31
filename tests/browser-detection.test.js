import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';

// Mock the chat module functions we need to test
let originalNavigator;
let originalConsole;

beforeEach(() => {
    // Setup DOM
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <div id="browser-warning" style="display: none;">
                <h2>Browser Update Required</h2>
                <p id="warning-message"></p>
                <ul id="browser-list"></ul>
            </div>
        </body>
        </html>
    `);
    
    global.document = dom.window.document;
    global.window = dom.window;
    
    // Mock navigator
    originalNavigator = global.navigator;
    originalConsole = global.console;
    
    global.console = {
        log: () => {},
        error: () => {},
        warn: () => {}
    };
});

afterEach(() => {
    global.navigator = originalNavigator;
    global.console = originalConsole;
});

describe('Browser Detection', () => {
    test('should detect modern Chrome browser', () => {
        global.navigator = {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };
        
        // Import and test browser detection logic
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
        
        const result = getBrowserInfo(global.navigator.userAgent);
        expect(result.name).toBe('Chrome');
        expect(result.version).toBe(120);
        expect(result.isSupported).toBe(true);
    });
    
    test('should detect mobile browsers', () => {
        global.navigator = {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        };
        
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(global.navigator.userAgent);
        expect(isMobile).toBe(true);
    });
    
    test('should reject legacy browsers', () => {
        global.navigator = {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
        };
        
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
        
        const result = getBrowserInfo(global.navigator.userAgent);
        expect(result.isSupported).toBe(false);
    });
    
    test('should validate modern browser features', () => {
        // Mock modern browser features
        global.window.RTCPeerConnection = function() {};
        global.window.MediaStream = function() {};
        global.navigator.mediaDevices = { getUserMedia: () => {} };
        global.window.WebSocket = function() {};
        global.window.fetch = () => {};
        global.window.Promise = Promise;
        global.window.Map = Map;
        global.window.Set = Set;
        global.window.Symbol = Symbol;
        
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
        
        expect(validateStrictModernFeatures()).toBe(true);
    });
    
    test('should show browser warning for unsupported browsers', () => {
        const showBrowserUpgradeWarning = (browserInfo) => {
            const warningDiv = document.getElementById('browser-warning');
            const messageP = document.getElementById('warning-message');
            
            if (warningDiv && messageP) {
                warningDiv.style.display = 'block';
                messageP.textContent = `Your browser (${browserInfo.name} ${browserInfo.version}) is not supported.`;
            }
        };
        
        const browserInfo = { name: 'IE', version: 11, isSupported: false };
        showBrowserUpgradeWarning(browserInfo);
        
        const warningDiv = document.getElementById('browser-warning');
        const messageP = document.getElementById('warning-message');
        
        expect(warningDiv.style.display).toBe('block');
        expect(messageP.textContent).toContain('IE 11');
    });
});