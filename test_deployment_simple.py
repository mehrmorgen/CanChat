#!/usr/bin/env python3
"""
Simple deployment validation using requests
No additional dependencies required
"""

import urllib.request
import urllib.error
import json
import re
import time

def test_deployment_simple():
    """Simple deployment test using built-in libraries"""
    
    url = "https://mehrmorgen.github.io/CanChat/chat.html"
    
    print(f"🚀 Testing deployment at: {url}")
    
    try:
        # Test 1: Basic connectivity
        print("⏳ Testing basic connectivity...")
        with urllib.request.urlopen(url, timeout=10) as response:
            if response.status == 200:
                print("✅ Deployment is accessible (HTTP 200)")
            else:
                print(f"❌ Unexpected status code: {response.status}")
                return False
            
            # Test 2: Content validation
            content = response.read().decode('utf-8')
            print(f"✅ Content loaded: {len(content)} characters")
            
            # Test 3: Check for required elements
            required_elements = [
                '<title>WebRTC PeerJS Chat</title>',
                '<h1>WebRTC PeerJS Chat</h1>',
                'id="my-id"',
                'id="peer-id-input"',
                'id="connect-btn"',
                'id="chat-log"',
                'id="message-input"',
                'id="send-btn"',
                'id="test-output"'
            ]
            
            for element in required_elements:
                if element in content:
                    print(f"✅ Found: {element}")
                else:
                    print(f"❌ Missing: {element}")
                    return False
            
            # Test 4: Check for PeerJS library
            if 'peerjs@1.5.0' in content:
                print("✅ PeerJS library reference found")
            else:
                print("❌ PeerJS library reference missing")
                return False
            
            # Test 5: Check for HTTPS resources
            http_resources = re.findall(r'http://[^"\s]+', content)
            if http_resources:
                print(f"⚠️  Found {len(http_resources)} HTTP resources (should be HTTPS):")
                for resource in http_resources:
                    print(f"   - {resource}")
            else:
                print("✅ All resources use HTTPS")
            
            # Test 6: Check for modern browser detection
            if 'detectAndBlockLegacyBrowsers' in content:
                print("✅ Modern browser detection found")
            else:
                print("❌ Modern browser detection missing")
                return False
            
            # Test 7: Check for test framework
            if 'describe(' in content and 'test(' in content:
                print("✅ Test framework found")
            else:
                print("❌ Test framework missing")
                return False
            
            # Test 8: Check for WebRTC functionality
            webrtc_features = [
                'RTCPeerConnection',
                'RTCDataChannel',
                'stun:stun.l.google.com:19302',
                'new Peer('
            ]
            
            for feature in webrtc_features:
                if feature in content:
                    print(f"✅ WebRTC feature found: {feature}")
                else:
                    print(f"❌ WebRTC feature missing: {feature}")
                    return False
            
            print("\n🎉 All simple deployment tests passed!")
            return True
            
    except urllib.error.URLError as e:
        print(f"❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_external_dependencies():
    """Test external dependencies"""
    
    dependencies = [
        "https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js"
    ]
    
    print("\n🔗 Testing external dependencies...")
    
    for dep in dependencies:
        try:
            with urllib.request.urlopen(dep, timeout=10) as response:
                if response.status == 200:
                    print(f"✅ {dep} - OK")
                else:
                    print(f"❌ {dep} - Status: {response.status}")
        except Exception as e:
            print(f"❌ {dep} - Error: {e}")

if __name__ == "__main__":
    success = test_deployment_simple()
    test_external_dependencies()
    
    if success:
        print("\n✅ Deployment validation completed successfully!")
        exit(0)
    else:
        print("\n❌ Deployment validation failed!")
        exit(1)