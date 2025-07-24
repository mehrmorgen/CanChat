// Simple test to verify validation functions work
console.log('Testing validation functions...');

// Test validatePeerIdInput
function testValidatePeerIdInput() {
    console.log('Testing validatePeerIdInput:');
    console.log('Empty string:', validatePeerIdInput('') === false ? 'PASS' : 'FAIL');
    console.log('Whitespace only:', validatePeerIdInput('   ') === false ? 'PASS' : 'FAIL');
    console.log('Valid ID:', validatePeerIdInput('valid-id') === true ? 'PASS' : 'FAIL');
}

// Test validateSelfConnection
function testValidateSelfConnection() {
    console.log('Testing validateSelfConnection:');
    window.myId = 'test-id';
    console.log('Self connection:', validateSelfConnection('test-id') === false ? 'PASS' : 'FAIL');
    console.log('Different peer:', validateSelfConnection('other-id') === true ? 'PASS' : 'FAIL');
}

// Test error handling functions
function testErrorHandling() {
    console.log('Testing error handling functions:');
    
    // Mock addSystemMessage for testing
    let lastMessage = '';
    window.addSystemMessage = function(msg) {
        lastMessage = msg;
    };
    
    handleConnectionError({ type: 'peer-unavailable', message: 'test' });
    console.log('Peer unavailable error:', lastMessage.includes('Peer not found') ? 'PASS' : 'FAIL');
    
    handlePeerError({ type: 'network', message: 'test' });
    console.log('Network error:', lastMessage.includes('Network error') ? 'PASS' : 'FAIL');
}

// Run tests if functions are available
if (typeof validatePeerIdInput !== 'undefined') {
    testValidatePeerIdInput();
}
if (typeof validateSelfConnection !== 'undefined') {
    testValidateSelfConnection();
}
if (typeof handleConnectionError !== 'undefined' && typeof handlePeerError !== 'undefined') {
    testErrorHandling();
}