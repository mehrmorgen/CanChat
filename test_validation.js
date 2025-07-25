// Simple validation script to test HTTPS readiness
console.log('🔍 Validating HTTPS deployment readiness...');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    console.log('✅ Running in browser environment');
    
    // Check protocol
    console.log(`📍 Current protocol: ${window.location.protocol}`);
    
    // Check secure context
    console.log(`🔒 Secure context: ${window.isSecureContext}`);
    
    // Check WebRTC APIs
    console.log(`🌐 RTCPeerConnection available: ${typeof RTCPeerConnection !== 'undefined'}`);
    
    // Check external resources
    const scripts = document.querySelectorAll('script[src]');
    console.log(`📦 External scripts found: ${scripts.length}`);
    
    scripts.forEach((script, index) => {
        console.log(`  ${index + 1}. ${script.src} (${script.src.startsWith('https://') ? 'HTTPS ✅' : 'HTTP ⚠️'})`);
    });
    
} else {
    console.log('❌ Not running in browser environment');
}

console.log('✅ Validation complete');