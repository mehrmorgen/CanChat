/**
 * Main Chat Application Module
 * WebRTC PeerJS Chat Application with ESM structure
 * Uses modern JavaScript features and native ESM imports
 */

// External dependencies - PeerJS is loaded globally via script tag
// Access via window.Peer since the CDN version doesn't support ESM
// Use optional chaining for testing environments
const Peer = (typeof window !== 'undefined') ? window.Peer : null;

// Internal modules
import { 
    validatePeerId,
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

// Media state for A/V and screen sharing
let mediaCall = null; // PeerJS MediaConnection
let localStream = null; // MediaStream for microphone/camera
let originalCamTrack = null; // To restore after screen sharing
let isMuted = false;
let isCamOff = false;
let isSharing = false;

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
        // ['Nullish Coalescing', () => null ?? 'default'],
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
    
    // Update status text if available
    if (statusText) {
        statusText.textContent = message;
    }
    
    // Update status indicator if available
    if (statusIndicator) {
        // Remove all status classes
        statusIndicator.className = 'status-indicator';
        
        // Add appropriate status class
        statusIndicator.classList.add(`status-${status}`);
    }
    
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

        // Handle incoming media (A/V) calls
        if (typeof peer.on === 'function') {
            peer.on('call', (call) => {
                addSystemMessage('📲 Incoming media call');
                handleIncomingMediaCall(call);
            });
        }

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
            reliable: true
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
    try {
        if (typeof data === 'string') {
            // Try to parse JSON control messages for file transfer
            try {
                const maybe = JSON.parse(data);
                if (maybe && maybe.__type === 'file-header') {
                    handleFileHeader(maybe);
                    return;
                }
                if (maybe && maybe.__type === 'file-end') {
                    handleFileEnd();
                    return;
                }
            } catch {/* not JSON -> treat as plain chat text */}
            addMessageToChat(data, 'peer');
            return;
        }

        // Binary chunk (ArrayBuffer or TypedArray)
        if (data instanceof ArrayBuffer || (data && typeof data.byteLength === 'number')) {
            const buf = data instanceof ArrayBuffer ? data : data.buffer;
            handleFileChunk(buf);
            return;
        }

        if (data && typeof data === 'object' && data.message) {
            addMessageToChat(data.message, 'peer');
            return;
        }

        console.warn('Received unknown data format:', data);
        addSystemMessage('⚠️ Received message in unknown format');
    } catch (err) {
        console.error('Error handling incoming data:', err);
        addSystemMessage('❌ Error handling incoming data');
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

// ===== FILE TRANSFER SUPPORT =====

const FILE_CHUNK_SIZE = 16 * 1024;
let incomingChunks = [];
let incomingMeta = null;
let incomingReceived = 0;

const getProgressEl = (id) => getElementById(id);

const updateProgress = (id, value) => {
    const el = getProgressEl(id);
    if (el && 'value' in el) {
        const v = Math.max(0, Math.min(100, Math.round(value)));
        try { el.value = v; } catch {}
    }
};

const addDownloadLink = (blob, name = 'download') => {
    const downloads = getElementById('downloads');
    if (!downloads) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.textContent = `Download ${name} (${blob.size} bytes)`;
    const div = document.createElement('div');
    div.appendChild(a);
    downloads.appendChild(div);
};

const handleFileHeader = (h) => {
    incomingMeta = h || {};
    incomingChunks = [];
    incomingReceived = 0;
    updateProgress('file-recv-progress', 0);
    if (incomingMeta?.name) {
        addSystemMessage(`📥 Incoming file: ${incomingMeta.name} (${incomingMeta.size ?? 0} bytes)`);
    }
};

const handleFileChunk = (buf) => {
    if (!buf) return;
    const arrBuf = buf instanceof ArrayBuffer ? buf : buf.buffer;
    incomingChunks.push(arrBuf);
    incomingReceived += arrBuf.byteLength ?? 0;
    if (incomingMeta?.size) {
        const pct = (incomingReceived / incomingMeta.size) * 100;
        updateProgress('file-recv-progress', pct);
    }
};

const handleFileEnd = () => {
    try {
        const blob = new Blob(incomingChunks, { type: incomingMeta?.mime || 'application/octet-stream' });
        addDownloadLink(blob, incomingMeta?.name || 'download');
        updateProgress('file-recv-progress', 100);
        addSystemMessage('✅ File received');
    } finally {
        incomingChunks = [];
        incomingMeta = null;
        incomingReceived = 0;
    }
};

const sendFile = async (file, onProgress) => {
    if (!connection?.open || !file) {
        addSystemMessage('❌ Cannot send file: no connection or file missing');
        return;
    }
    try {
        const header = { __type: 'file-header', name: file.name, size: file.size, mime: file.type || 'application/octet-stream' };
        connection.send(JSON.stringify(header));
        for (let offset = 0; offset < file.size; offset += FILE_CHUNK_SIZE) {
            const slice = file.slice(offset, offset + FILE_CHUNK_SIZE);
            const buf = await slice.arrayBuffer();
            connection.send(buf);
            const pct = Math.min(100, Math.round(((offset + FILE_CHUNK_SIZE) / file.size) * 100));
            if (typeof onProgress === 'function') onProgress(pct);
            if (connection.bufferSize > 4 * FILE_CHUNK_SIZE) {
                await new Promise(r => setTimeout(r, 4));
            }
        }
        connection.send(JSON.stringify({ __type: 'file-end' }));
        addSystemMessage(`📤 File sent: ${file.name} (${file.size} bytes)`);
    } catch (err) {
        console.error('sendFile error:', err);
        addSystemMessage('❌ Failed to send file');
    }
};

// ===== MEDIA CALL SUPPORT =====

const getEl = (id) => getElementById(id);
const getLocalVideoEl = () => getEl('local-video');
const getRemoteVideoEl = () => getEl('remote-video');

const setCallControls = (active = false) => {
    const startBtn = getEl('start-call-btn');
    const hangupBtn = getEl('hangup-btn');
    const muteBtn = getEl('mute-btn');
    const camBtn = getEl('cam-btn');
    const shareBtn = getEl('share-btn');
    const stopShareBtn = getEl('stop-share-btn');

    if (startBtn) startBtn.disabled = !connection?.open || active;
    if (hangupBtn) hangupBtn.disabled = !active;
    if (muteBtn) {
        muteBtn.disabled = !active;
        muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    }
    if (camBtn) {
        camBtn.disabled = !active;
        camBtn.textContent = isCamOff ? 'Camera On' : 'Camera Off';
    }
    if (shareBtn) shareBtn.disabled = !active || isSharing;
    if (stopShareBtn) stopShareBtn.disabled = !active || !isSharing;
};

const attachLocalVideo = (stream) => {
    const v = getLocalVideoEl();
    if (v) {
        try { v.srcObject = stream; } catch {}
    }
};

const attachRemoteVideo = (stream) => {
    const v = getRemoteVideoEl();
    if (v) {
        try { v.srcObject = stream; } catch {}
    }
};

const stopStreamTracks = (stream) => {
    try { stream?.getTracks?.().forEach(t => t.stop()); } catch {}
};

const getLocalMediaStream = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
        addSystemMessage('❌ Media devices not available');
        throw new Error('media devices unavailable');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStream = stream;
    // keep reference of original cam track
    originalCamTrack = stream.getVideoTracks?.()[0] || null;
    isMuted = false;
    isCamOff = false;
    attachLocalVideo(stream);
    return stream;
};

const handleIncomingMediaCall = async (call) => {
    try {
        if (!localStream) await getLocalMediaStream();
        mediaCall = call;
        setCallControls(true);
        call.on('stream', (remoteStream) => {
            attachRemoteVideo(remoteStream);
            addSystemMessage('🎥 Remote stream received');
        });
        call.on('close', () => {
            addSystemMessage('📴 Call ended');
            setCallControls(false);
            isSharing = false;
            attachRemoteVideo(null);
            attachLocalVideo(null);
            stopStreamTracks(localStream);
            localStream = null;
            mediaCall = null;
        });
        call.answer(localStream);
        addSystemMessage('✅ Answered incoming call');
    } catch (err) {
        console.error('Failed to answer call', err);
        addSystemMessage('❌ Failed to answer call');
        try { call.close(); } catch {}
    }
};

const handleStartCallClick = async () => {
    if (!peer || !connection?.open) {
        addSystemMessage('❌ Connect to a peer first');
        return;
    }
    try {
        const stream = localStream || await getLocalMediaStream();
        mediaCall = peer.call(connection.peer, stream);
        if (!mediaCall) {
            addSystemMessage('❌ Failed to start call');
            return;
        }
        mediaCall.on('stream', (remoteStream) => {
            attachRemoteVideo(remoteStream);
            addSystemMessage('🎥 Remote stream received');
        });
        mediaCall.on('close', () => {
            addSystemMessage('📴 Call ended');
            setCallControls(false);
            isSharing = false;
            attachRemoteVideo(null);
            attachLocalVideo(null);
            stopStreamTracks(localStream);
            localStream = null;
            mediaCall = null;
        });
        setCallControls(true);
        addSystemMessage('📞 Calling peer...');
    } catch (err) {
        console.error('Start call failed', err);
        addSystemMessage('❌ Start call failed');
    }
};

const handleHangupClick = () => {
    try { mediaCall?.close(); } catch {}
    try { stopStreamTracks(localStream); } catch {}
    mediaCall = null;
    localStream = null;
    isSharing = false;
    setCallControls(false);
    attachLocalVideo(null);
    attachRemoteVideo(null);
};

const handleMuteClick = () => {
    if (!localStream) return;
    const track = localStream.getAudioTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    isMuted = !track.enabled ? true : false;
    setCallControls(true);
};

const handleCamClick = () => {
    if (!localStream) return;
    const track = localStream.getVideoTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    isCamOff = !track.enabled ? true : false;
    setCallControls(true);
};

const replaceVideoTrack = async (newTrack) => {
    const sender = mediaCall?.peerConnection?.getSenders?.().find(s => s.track && s.track.kind === 'video');
    if (sender && newTrack) {
        try { await sender.replaceTrack(newTrack); } catch (e) { console.warn('replaceTrack failed', e); }
    }
};

const handleShareClick = async () => {
    if (!mediaCall) { addSystemMessage('❌ Start a call first'); return; }
    try {
        if (!navigator?.mediaDevices?.getDisplayMedia) {
            addSystemMessage('❌ Screen share not supported');
            return;
        }
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        const screenTrack = displayStream.getVideoTracks?.()[0];
        if (!screenTrack) { addSystemMessage('❌ No screen track'); return; }
        if (!originalCamTrack && localStream) {
            originalCamTrack = localStream.getVideoTracks?.()[0] || null;
        }
        await replaceVideoTrack(screenTrack);
        // also show local preview as screen
        attachLocalVideo(displayStream);
        isSharing = true;
        setCallControls(true);
        // When user stops sharing from browser UI
        screenTrack.onended = async () => { try { await handleStopShareClick(); } catch {} };
        addSystemMessage('🖥️ Screen sharing started');
    } catch (err) {
        console.error('Screen share failed', err);
        addSystemMessage('❌ Screen share failed');
    }
};

const handleStopShareClick = async () => {
    if (!isSharing) return;
    try {
        const camTrack = originalCamTrack;
        if (camTrack) {
            await replaceVideoTrack(camTrack);
            // restore local preview to camera stream if available
            if (localStream) attachLocalVideo(localStream);
        }
    } catch (err) {
        console.warn('Stop share error', err);
    } finally {
        isSharing = false;
        setCallControls(true);
        addSystemMessage('🛑 Screen sharing stopped');
    }
};

// ===== UI CONTROL FUNCTIONS =====

/**
 * Enables the send button
 */
const enableSendButton = () => {
    const sendBtn = getElementById('send-btn');
    if (sendBtn) sendBtn.disabled = false;
    const sendFileBtn = getElementById('send-file-btn');
    if (sendFileBtn) sendFileBtn.disabled = false;
    // Enable call controls for an idle (not yet active) call when connected
    try { setCallControls(false); } catch {}
};

/**
 * Disables the send button
 */
const disableSendButton = () => {
    const sendBtn = getElementById('send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
    }
    const sendFileBtn = getElementById('send-file-btn');
    if (sendFileBtn) {
        sendFileBtn.disabled = true;
    }
    try { setCallControls(false); } catch {}
};

/**
 * Handles connection close events
 */
const handleConnectionClose = () => {
    addSystemMessage('🔌 Peer connection closed');
    updateConnectionStatus('disconnected', 'Connection closed');
    // Clean up media state
    try { mediaCall?.close(); } catch {}
    try { stopStreamTracks(localStream); } catch {}
    mediaCall = null;
    localStream = null;
    originalCamTrack = null;
    isMuted = false;
    isCamOff = false;
    isSharing = false;
    try { attachLocalVideo(null); } catch {}
    try { attachRemoteVideo(null); } catch {}
    setCallControls(false);
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
 * Handles send file button click
 */
const handleSendFileClick = async () => {
    const fileInput = getElementById('file-input');
    const sendFileBtn = getElementById('send-file-btn');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        addSystemMessage('❌ Please choose a file to send.');
        return;
    }
    const file = fileInput.files[0];
    if (sendFileBtn) sendFileBtn.disabled = true;
    try {
        await sendFile(file, (pct) => updateProgress('file-send-progress', pct));
        updateProgress('file-send-progress', 100);
    } finally {
        if (sendFileBtn) sendFileBtn.disabled = false;
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
        ['message-input', 'keypress', handleMessageInputKeyPress],
        ['send-file-btn', 'click', handleSendFileClick],
        ['start-call-btn', 'click', handleStartCallClick],
        ['hangup-btn', 'click', handleHangupClick],
        ['mute-btn', 'click', handleMuteClick],
        ['cam-btn', 'click', handleCamClick],
        ['share-btn', 'click', handleShareClick],
        ['stop-share-btn', 'click', handleStopShareClick]
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
const initializeApp = () => {
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

// Initialize when DOM is ready (only in browser environment)
if (typeof document !== 'undefined') {
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
}

// Export main functions for testing and external use
export {
    initializeApp,
    connectToPeer,
    sendMessage,
    handleReceivedMessage,
    updateConnectionStatus,
    enableSendButton,
    disableSendButton,
    handleConnectionClose,
    setupEventListeners
};