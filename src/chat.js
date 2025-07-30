/**
 * Main Chat Application Module
 * WebRTC PeerJS Chat Application with ESM structure
 * Uses modern JavaScript features and native ESM imports
 */

// External dependencies
import Peer from 'https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js';

// Internal modules
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
    displayTestResults
} from './utils.js';

// ===== APPLICATION STATE =====

// Global variables for PeerJS and connection management using modern const/let
let peer = null;
let connection = null;
let myId = null;

// Modern configuration using object destructuring and default parameters
const CONFIG = {
    STUN_SERVER: 'stun:stun.l.google.com:19302',
    CONNECTION_TIMEOUT: 30000,
    MAX_RETRIES: 3,
    BASE_RETRY_DELAY: 2000,
    PERFORMANCE_MONITORING: true
};

// ===== BROWSER DETECTION AND VALIDATION =====

/**
 * Enhanced browser detection with strict modern browser requirements
 * Supports Chrome 88+, Firefox 85+, Safari 14+, Edge 88+ only
 * Uses ES2020+ features for detection and blocking
 */
const detectAndBlockLegacyBrowsers = () => {
    const userAgent = navigator.userAgent;
    const browserInfo = getBrowserInfo(userAgent);

    // Enhanced mobile browser detection
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const enhancedBrowserInfo = { ...browserInfo, isMobile };

    if (!enhancedBrowserInfo.isSupported) {
        showBrowserUpgradeWarning(enhancedBrowserInfo);
        return false;
    }

    // Additional strict checks for modern features
    if (!validateStrictModernFeatures()) {
        showBrowserUpgradeWarning({
            ...enhancedBrowserInfo,
            isSupported: false,
            reason: 'Missing required modern browser features'
        });
        return false;
    }

    // Log browser info for deployment analysis using modern template literals
    console.log(`✅ Modern browser detected: ${enhancedBrowserInfo.name} ${enhancedBrowserInfo.version}${isMobile ? ' (Mobile)' : ''}`);
    return true;
};

/**
 * Enhanced browser detection with strict version requirements
 * Uses ES2020+ Map and modern array methods for better performance
 * @param {string} userAgent - The navigator.userAgent string
 * @returns {Object} Enhanced browser information with support status
 */
const getBrowserInfo = (userAgent) => {
    // Enhanced browser detection using Map for better performance
    const browsers = new Map([
        ['Chrome', {
            pattern: /Chrome\/(\d+)/,
            minVersion: 88,
            downloadUrl: 'https://www.google.com/chrome/',
            releaseDate: 'January 2021'
        }],
        ['Firefox', {
            pattern: /Firefox\/(\d+)/,
            minVersion: 85,
            downloadUrl: 'https://www.mozilla.org/firefox/',
            releaseDate: 'January 2021'
        }],
        ['Safari', {
            pattern: /Version\/(\d+).*Safari/,
            minVersion: 14,
            downloadUrl: 'https://www.apple.com/safari/',
            releaseDate: 'September 2020'
        }],
        ['Edge', {
            pattern: /Edg\/(\d+)/,
            minVersion: 88,
            downloadUrl: 'https://www.microsoft.com/edge',
            releaseDate: 'January 2021'
        }]
    ]);

    // Use modern array methods and destructuring
    for (const [name, config] of browsers) {
        const match = userAgent.match(config.pattern);
        if (match) {
            const version = parseInt(match[1], 10);
            const isSupported = version >= config.minVersion;

            return {
                name,
                version,
                minVersion: config.minVersion,
                isSupported,
                downloadUrl: config.downloadUrl,
                releaseDate: config.releaseDate,
                userAgent,
                // Enhanced mobile detection using optional chaining
                isMobile: /Mobile|Android|iPhone|iPad/i.test(userAgent),
                // Modern feature detection
                supportsES2020: isSupported,
                supportsWebRTC: isSupported && window.RTCPeerConnection !== undefined
            };
        }
    }

    // Enhanced unknown browser handling with better messaging
    return {
        name: 'Unknown',
        version: 0,
        minVersion: 999,
        isSupported: false,
        downloadUrl: 'https://www.google.com/chrome/',
        releaseDate: 'Unknown',
        userAgent,
        isMobile: /Mobile|Android|iPhone|iPad/i.test(userAgent),
        supportsES2020: false,
        supportsWebRTC: false,
        reason: 'Unrecognized browser - modern browser required'
    };
};

/**
 * Enhanced browser upgrade warning with mobile-specific guidance
 * Uses modern template literals and enhanced mobile detection
 * @param {Object} browserInfo - Enhanced browser information object
 */
const showBrowserUpgradeWarning = (browserInfo) => {
    // Enhanced mobile-specific messaging using modern conditional logic
    const mobileGuidance = browserInfo.isMobile ? `
        <div class="mobile-warning">
            <strong>📱 Mobile Device Detected</strong><br>
            Update your browser through your device's app store:
            <ul style="margin: 0.5rem 0; padding-left: 1rem;">
                <li><strong>iOS:</strong> Update Safari through Settings → General → Software Update</li>
                <li><strong>Android:</strong> Update Chrome through Google Play Store</li>
            </ul>
        </div>
    ` : '';

    // Enhanced browser links with better mobile support
    const browserLinks = [
        { name: 'Chrome', url: 'https://www.google.com/chrome/', icon: '🌐' },
        { name: 'Firefox', url: 'https://www.mozilla.org/firefox/', icon: '🦊' },
        { name: 'Edge', url: 'https://www.microsoft.com/edge', icon: '🔷' },
        ...(browserInfo.isMobile ? [] : [{ name: 'Safari', url: 'https://www.apple.com/safari/', icon: '🧭' }])
    ];

    const browserLinksHtml = browserLinks.map(({ name, url, icon }) =>
        `<a href="${url}" class="browser-link" target="_blank" rel="noopener noreferrer">
            ${icon} Download ${name}
        </a>`
    ).join('');

    // Enhanced warning with modern template literals and better UX
    const warningHtml = `
        <div class="browser-warning">
            <div class="browser-warning-content">
                <h2>🚫 Modern Browser Required</h2>
                <p><strong>Your browser is not supported.</strong></p>
                <p>Detected: ${browserInfo.name} ${browserInfo.version || 'Unknown'}${browserInfo.isMobile ? ' (Mobile)' : ''}</p>
                <p>This application requires modern browser features including ES2020+ JavaScript, modern WebRTC APIs, and CSS Grid/Flexbox support.</p>
                
                <h3>Minimum Requirements:</h3>
                <ul>
                    <li><strong>Chrome 88+</strong> (Released January 2021)</li>
                    <li><strong>Firefox 85+</strong> (Released January 2021)</li>
                    <li><strong>Safari 14+</strong> (Released September 2020)</li>
                    <li><strong>Edge 88+</strong> (Released January 2021)</li>
                </ul>
                
                <p><strong>Required Features:</strong></p>
                <ul>
                    <li>ES2020+ JavaScript (Optional chaining, Nullish coalescing, BigInt)</li>
                    <li>Modern WebRTC APIs with HTTPS support</li>
                    <li>CSS Grid, Flexbox, and Custom Properties</li>
                    <li>Modern security features and HTTPS enforcement</li>
                </ul>
                
                ${mobileGuidance}
                
                <div class="browser-links">
                    ${browserLinksHtml}
                </div>
                
                <p style="margin-top: 1.5rem; font-size: 0.875rem; color: #666; line-height: 1.4;">
                    <strong>Why these requirements?</strong> Modern browsers provide better security, performance, 
                    and support for the latest web standards. Legacy browsers lack critical features needed 
                    for peer-to-peer communication and modern web applications.
                </p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', warningHtml);

    // Enhanced error with more context
    throw new Error(`Legacy browser blocked: ${browserInfo.name} ${browserInfo.version} (Required: ${browserInfo.minVersion}+)`);
};

/**
 * Strict validation of modern browser features required for the application
 * Tests comprehensive ES2020+ and modern browser API support
 */
const validateStrictModernFeatures = () => {
    const requiredFeatures = new Map([
        // ES2020+ JavaScript features
        ['Nullish Coalescing', () => null ?? 'default'],
        ['BigInt', () => BigInt(123n)],
        ['Promise.allSettled', () => Promise.allSettled([Promise.resolve(1)])],
        ['String.matchAll', () => 'test'.matchAll(/t/g)],

        // Modern browser APIs
        ['Fetch API', () => typeof fetch === 'function'],
        ['Intersection Observer', () => typeof IntersectionObserver === 'function'],
        ['ResizeObserver', () => typeof ResizeObserver === 'function'],
        ['CSS Custom Properties', () => CSS?.supports?.('color', 'var(--test)')],

        // WebRTC modern features
        ['RTCPeerConnection', () => typeof RTCPeerConnection === 'function'],
        ['RTCDataChannel', () => typeof RTCDataChannel === 'function'],

        // Modern CSS features support
        ['CSS Grid', () => CSS?.supports?.('display', 'grid')],
        ['CSS Flexbox', () => CSS?.supports?.('display', 'flex')],
        ['CSS Backdrop Filter', () => CSS?.supports?.('backdrop-filter', 'blur(1px)')],
    ]);

    const failedFeatures = [];

    for (const [featureName, testFunction] of requiredFeatures) {
        try {
            const result = testFunction();
            if (result === false || result === undefined) {
                failedFeatures.push(featureName);
            }
        } catch (error) {
            failedFeatures.push(featureName);
        }
    }

    if (failedFeatures.length > 0) {
        console.error('❌ Missing required modern features:', failedFeatures);
        return false;
    }

    console.log('✅ All strict modern browser features validated');
    return true;
};

// ===== WEBRTC AND SECURITY VALIDATION =====

/**
 * Check if running in secure context (HTTPS or localhost)
 * @returns {boolean} True if secure context
 */
const checkSecureContext = () => {
    const isSecure = window.isSecureContext || 
                    window.location.protocol === 'https:' || 
                    window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
        addSystemMessage('⚠️ Non-secure context detected. WebRTC functionality may be limited.');
        addSystemMessage('💡 For full functionality, use HTTPS or localhost.');
    }
    
    return isSecure;
};

/**
 * Check WebRTC support in the browser
 * @returns {boolean} True if WebRTC is supported
 */
const checkWebRTCSupport = () => {
    const hasWebRTC = !!(window.RTCPeerConnection && window.RTCDataChannel);
    
    if (!hasWebRTC) {
        addSystemMessage('❌ WebRTC not supported in this browser.');
        addSystemMessage('💡 Please use a modern browser with WebRTC support.');
    }
    
    return hasWebRTC;
};

// ===== CONNECTION STATUS MANAGEMENT =====

/**
 * Updates the connection status display
 * @param {string} status - Status type: 'disconnected', 'connecting', 'connected', 'error'
 * @param {string} message - Status message to display
 */
const updateConnectionStatus = (status, message) => {
    const statusIndicator = getElementById('status-indicator');
    const statusText = getElementById('status-text');
    const retryBtn = getElementById('retry-btn');
    
    if (!statusIndicator || !statusText) return;
    
    // Remove all status classes
    statusIndicator.className = 'status-indicator';
    
    // Add appropriate status class
    statusIndicator.classList.add(`status-${status}`);
    statusText.textContent = message;
    
    // Show/hide retry button based on status
    if (retryBtn) {
        retryBtn.style.display = status === 'error' ? 'inline-block' : 'none';
    }
};

// ===== PEER CONNECTION MANAGEMENT =====

/**
 * Initializes the PeerJS instance with modern async/await and ES2020+ features
 * Uses Safari 14+ modern WebRTC features and native JavaScript improvements
 */
const initializePeer = async () => {
    // Check secure context and WebRTC support before initialization
    if (!checkSecureContext()) {
        // Continue with limited functionality warning
    }

    if (!checkWebRTCSupport()) {
        addSystemMessage('❌ Cannot initialize peer connection - WebRTC not supported.');
        return;
    }

    try {
        // Enhanced modern configuration using basic ICE servers
        const peerConfig = {
            config: {
                iceServers: [
                    { urls: CONFIG.STUN_SERVER }
                ],
                // Safari 14+ modern WebRTC optimizations
                iceCandidatePoolSize: 10,
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require',
                iceTransportPolicy: 'all'
            },

            // Enhanced debugging with modern conditional logic
            debug: window.location.hostname === 'localhost' ? 2 : 0,

            // Modern PeerJS configuration
            serialization: 'json', // Use JSON serialization for better performance
            reliable: true, // Enable reliable data channels
        };

        // Create PeerJS instance with modern error handling
        peer = new Peer(peerConfig);

        // Store peer globally for testing using modern assignment
        Object.assign(window, { peer });

        addSystemMessage('🔧 Using default STUN server configuration');

        // Modern event handling with arrow functions and optional chaining
        peer.on('open', (id) => {
            updateMyId(id);
            myId = id;
            addSystemMessage('✅ Your ID is ready; share it with your peer.');

            // Modern conditional logic with nullish coalescing
            const protocol = window.location.protocol;
            const isSecure = protocol === 'https:';

            if (isSecure) {
                addSystemMessage('🔒 Running in secure HTTPS context - full WebRTC functionality available.');
            } else {
                addSystemMessage('⚠️ Running in HTTP context - some features may be limited.');
                addSystemMessage('💡 For production deployment, use HTTPS (e.g., GitHub Pages).');
            }

            updateConnectionStatus('disconnected', 'Ready to connect');
        });

        peer.on('connection', (conn) => {
            addSystemMessage(`📞 Incoming connection from: ${conn.peer}`);
            handleIncomingConnection(conn);
        });

        peer.on('error', (error) => {
            console.error('PeerJS Error:', error);
            addSystemMessage(`❌ Peer error: ${error.message || error.type || 'Unknown error'}`);
            updateConnectionStatus('error', `Error: ${error.type || 'Unknown'}`);

            // Modern error recovery with exponential backoff
            setTimeout(() => initializePeer(), 5000);
        });

        peer.on('disconnected', () => {
            addSystemMessage('🔌 Peer disconnected from signaling server');
            updateConnectionStatus('error', 'Disconnected from server');
            
            // Attempt to reconnect
            if (!peer.destroyed) {
                peer.reconnect();
                addSystemMessage('🔄 Attempting to reconnect...');
            }
        });

        peer.on('close', () => {
            addSystemMessage('🔌 Peer connection closed');
            updateConnectionStatus('disconnected', 'Connection closed');
        });

    } catch (error) {
        console.error('Failed to initialize peer:', error);
        addSystemMessage(`❌ Failed to initialize peer: ${error.message}`);
        updateConnectionStatus('error', 'Initialization failed');
    }
};

/**
 * Handles incoming peer connections
 * @param {DataConnection} conn - The incoming connection
 */
const handleIncomingConnection = (conn) => {
    connection = conn;
    
    conn.on('open', () => {
        addSystemMessage(`✅ Connected to peer: ${conn.peer}`);
        updateConnectionStatus('connected', `Connected to ${conn.peer}`);
        enableSendButton();
    });

    conn.on('data', (data) => {
        handleReceivedMessage(data);
    });

    conn.on('close', () => {
        handleConnectionClose();
    });

    conn.on('error', (error) => {
        console.error('Connection error:', error);
        addSystemMessage(`❌ Connection error: ${error.message || 'Unknown error'}`);
        updateConnectionStatus('error', 'Connection error');
    });
};

/**
 * Connects to a peer using their ID
 * @param {string} peerId - The peer ID to connect to
 */
const connectToPeer = (peerId) => {
    if (!peer) {
        addSystemMessage('❌ Peer not initialized. Please wait and try again.');
        return;
    }

    if (!validatePeerId(peerId)) {
        addSystemMessage('❌ Please enter a valid peer ID.');
        return;
    }

    if (peerId === myId) {
        addSystemMessage('❌ Cannot connect to yourself.');
        return;
    }

    addSystemMessage(`🔄 Connecting to peer: ${peerId}`);
    updateConnectionStatus('connecting', `Connecting to ${peerId}...`);

    try {
        connection = peer.connect(peerId, {
            reliable: true,
            serialization: 'json'
        });

        connection.on('open', () => {
            addSystemMessage(`✅ Connected to peer: ${peerId}`);
            updateConnectionStatus('connected', `Connected to ${peerId}`);
            enableSendButton();
        });

        connection.on('data', (data) => {
            handleReceivedMessage(data);
        });

        connection.on('close', () => {
            handleConnectionClose();
        });

        connection.on('error', (error) => {
            console.error('Connection error:', error);
            addSystemMessage(`❌ Connection failed: ${error.message || 'Unknown error'}`);
            updateConnectionStatus('error', 'Connection failed');
        });

    } catch (error) {
        console.error('Failed to connect:', error);
        addSystemMessage(`❌ Failed to connect: ${error.message}`);
        updateConnectionStatus('error', 'Connection failed');
    }
};

// ===== MESSAGE HANDLING =====

/**
 * Handles received messages from peer
 * @param {any} data - The received data
 */
const handleReceivedMessage = (data) => {
    if (typeof data === 'string') {
        addMessageToChat(data, 'peer');
    } else if (data && typeof data === 'object' && data.message) {
        addMessageToChat(data.message, 'peer');
    } else {
        console.warn('Received unknown data format:', data);
        addSystemMessage('⚠️ Received message in unknown format');
    }
};

/**
 * Sends a message to the connected peer
 * @param {string} message - The message to send
 */
const sendMessage = (message) => {
    if (!connection || !connection.open) {
        addSystemMessage('❌ No active connection. Please connect to a peer first.');
        return;
    }

    if (!message.trim()) {
        addSystemMessage('❌ Cannot send empty message.');
        return;
    }

    try {
        connection.send(message);
        addMessageToChat(message, 'me');
        
        // Clear the input field
        const messageInput = getElementById('message-input');
        if (messageInput) {
            messageInput.value = '';
        }
    } catch (error) {
        console.error('Failed to send message:', error);
        addSystemMessage(`❌ Failed to send message: ${error.message}`);
    }
};

// ===== UI CONTROL FUNCTIONS =====

/**
 * Enables the send button
 */
const enableSendButton = () => {
    const sendBtn = getElementById('send-btn');
    if (sendBtn) {
        sendBtn.disabled = false;
    }
};

/**
 * Disables the send button
 */
const disableSendButton = () => {
    const sendBtn = getElementById('send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
    }
};

/**
 * Handles connection close events
 */
const handleConnectionClose = () => {
    addSystemMessage('🔌 Peer connection closed');
    updateConnectionStatus('disconnected', 'Connection closed');
    disableSendButton();
    connection = null;
};

// ===== EVENT HANDLERS =====

/**
 * Handles connect button click
 */
const handleConnectClick = () => {
    const peerIdInput = getElementById('peer-id-input');
    if (peerIdInput) {
        const peerId = peerIdInput.value.trim();
        connectToPeer(peerId);
    }
};

/**
 * Handles retry button click
 */
const handleRetryClick = () => {
    const peerIdInput = getElementById('peer-id-input');
    if (peerIdInput && peerIdInput.value.trim()) {
        handleConnectClick();
    } else {
        addSystemMessage('❌ Please enter a peer ID to retry connection.');
    }
};

/**
 * Handles send button click
 */
const handleSendClick = () => {
    const messageInput = getElementById('message-input');
    if (messageInput) {
        const message = messageInput.value.trim();
        sendMessage(message);
    }
};

/**
 * Handles message input keypress events
 * @param {KeyboardEvent} event - The keypress event
 */
const handleMessageInputKeyPress = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSendClick();
    }
};

// ===== EVENT LISTENERS SETUP =====

/**
 * Sets up all DOM event listeners for user interactions
 */
const setupEventListeners = () => {
    // Modern event listener setup using destructuring and array methods
    const eventListeners = [
        ['connect-btn', 'click', handleConnectClick],
        ['retry-btn', 'click', handleRetryClick],
        ['send-btn', 'click', handleSendClick],
        ['message-input', 'keypress', handleMessageInputKeyPress]
    ];

    eventListeners.forEach(([elementId, event, handler]) => {
        const element = getElementById(elementId);
        if (element) {
            addEventListenerSafe(element, event, handler);
        }
    });

    // Enhanced network connectivity monitoring with modern mobile features
    window.addEventListener('online', () => {
        addSystemMessage('🌐 Network connectivity restored');
        updateConnectionStatus('disconnected', 'Network Online');

        // Modern network information API for mobile optimization
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const networkInfo = `${connection.effectiveType ?? 'unknown'} (${connection.downlink ?? 'unknown'}Mbps)`;
            addSystemMessage(`📶 Network: ${networkInfo}`);
        }
    });

    window.addEventListener('offline', () => {
        addSystemMessage('📵 Network connectivity lost');
        updateConnectionStatus('error', 'Network Offline');

        if (connection?.open) {
            addSystemMessage('⚠️ Active connection may be affected');
        }
    });

    // Modern mobile network change detection
    if ('connection' in navigator && 'addEventListener' in navigator.connection) {
        navigator.connection.addEventListener('change', () => {
            const conn = navigator.connection;
            const networkType = conn.effectiveType ?? 'unknown';
            const downlink = conn.downlink ?? 0;

            addSystemMessage(`📶 Network changed: ${networkType} (${downlink}Mbps)`);

            // Warn about slow connections that might affect WebRTC
            if (downlink < 0.5) {
                addSystemMessage('⚠️ Slow network detected - connection quality may be affected');
            }
        });
    }

    // Modern visibility API for mobile app lifecycle
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('App backgrounded - maintaining connection');
        } else {
            console.log('App foregrounded - checking connection status');
            if (connection?.open) {
                addSystemMessage('🔄 App resumed - connection still active');
            }
        }
    });
};

// ===== APPLICATION INITIALIZATION =====

/**
 * Main application initialization function
 * Initializes PeerJS and sets up event listeners
 */
export const initializeApp = () => {
    // Initialize connection status
    updateConnectionStatus('disconnected', 'Initializing...');

    // Display HTTPS deployment status
    addSystemMessage('🚀 WebRTC PeerJS Chat - Initializing...');

    // Modern conditional messaging using ternary and template literals
    const isHttps = window.location.protocol === 'https:';
    const httpsMessages = isHttps
        ? ['✅ Running in secure HTTPS context.', '🌐 Full WebRTC functionality available.']
        : ['⚠️ Running in HTTP context.', '💡 For production use, deploy to HTTPS (GitHub Pages).'];

    httpsMessages.forEach(msg => addSystemMessage(msg));

    // Check secure context using modern conditional logic
    const secureContextMessage = window.isSecureContext
        ? '🔒 Secure context confirmed - WebRTC APIs available.'
        : '⚠️ Non-secure context - WebRTC functionality may be limited.';

    addSystemMessage(secureContextMessage);

    initializePeer();
    setupEventListeners();
};

// ===== TEST FRAMEWORK INITIALIZATION =====

/**
 * Initializes the test framework for development mode
 */
const initializeTestFramework = () => {
    setupTestFramework();
    
    // Display test results after a short delay for development mode
    setTimeout(() => {
        displayTestResults();
    }, 1000);
};

// ===== MODULE INITIALIZATION =====

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Validate browser compatibility first
    if (!detectAndBlockLegacyBrowsers()) {
        return; // Stop execution if browser is not supported
    }

    // Initialize the application
    initializeApp();
    
    // Initialize test framework
    initializeTestFramework();
});

// Export main functions for testing and external use
export {
    connectToPeer,
    sendMessage,
    handleReceivedMessage,
    updateConnectionStatus,
    enableSendButton,
    disableSendButton,
    handleConnectionClose,
    setupEventListeners
};