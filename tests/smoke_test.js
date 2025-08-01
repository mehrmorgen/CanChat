/**
 * Smoke Test Script for WebRTC Chat Application
 * Tests the actual application functionality by loading the modules
 */

// Test 1: Verify modules can be imported
console.log('🧪 Testing module imports...');

try {
    // Test utils module
    const utilsResponse = await fetch('http://localhost:3000/src/utils.js');
    if (utilsResponse.ok) {
        console.log('✅ Utils module loads successfully');
    } else {
        console.log('❌ Utils module failed to load');
    }

    // Test chat module
    const chatResponse = await fetch('http://localhost:3000/src/chat.js');
    if (chatResponse.ok) {
        console.log('✅ Chat module loads successfully');
    } else {
        console.log('❌ Chat module failed to load');
    }

    // Test styles
    const stylesResponse = await fetch('http://localhost:3000/src/styles.css');
    if (stylesResponse.ok) {
        console.log('✅ Styles load successfully');
    } else {
        console.log('❌ Styles failed to load');
    }

    // Test main HTML
    const htmlResponse = await fetch('http://localhost:3000/chat.html');
    if (htmlResponse.ok) {
        console.log('✅ Main HTML loads successfully');
    } else {
        console.log('❌ Main HTML failed to load');
    }

} catch (error) {
    console.log('❌ Module loading test failed:', error.message);
}

// Test 2: Verify PeerJS dependency
console.log('\n🧪 Testing external dependencies...');

try {
    const peerJSResponse = await fetch('https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js');
    if (peerJSResponse.ok) {
        console.log('✅ PeerJS library is accessible');
    } else {
        console.log('❌ PeerJS library failed to load');
    }
} catch (error) {
    console.log('❌ PeerJS dependency test failed:', error.message);
}

// Test 3: Verify server responsiveness
console.log('\n🧪 Testing server responsiveness...');

const startTime = Date.now();
try {
    const response = await fetch('http://localhost:3000/chat.html');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok && responseTime < 1000) {
        console.log(`✅ Server responds quickly (${responseTime}ms)`);
    } else {
        console.log(`⚠️ Server response time: ${responseTime}ms`);
    }
} catch (error) {
    console.log('❌ Server responsiveness test failed:', error.message);
}

console.log('\n🎯 Smoke test completed!');
console.log('📝 Manual testing required for:');
console.log('   - Peer-to-peer connection establishment');
console.log('   - Message exchange between browser instances');
console.log('   - WebRTC functionality');
console.log('   - Responsive design on mobile devices');