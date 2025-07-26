#!/usr/bin/env python3
"""
Browser automation test for WebRTC PeerJS Chat deployment
Requires: pip install playwright
Run: python test_deployment.py
"""

import asyncio
from playwright.async_api import async_playwright
import time

async def test_deployment():
    """Test the deployed WebRTC chat application"""
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False)  # Set to True for headless
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            print("🚀 Testing deployment at: https://mehrmorgen.github.io/CanChat/chat.html")
            
            # Navigate to the deployed application
            await page.goto("https://mehrmorgen.github.io/CanChat/chat.html")
            
            # Wait for page to load
            await page.wait_for_load_state('networkidle')
            
            # Test 1: Check page title
            title = await page.title()
            print(f"✅ Page title: {title}")
            assert title == "WebRTC PeerJS Chat", f"Expected 'WebRTC PeerJS Chat', got '{title}'"
            
            # Test 2: Check main heading
            heading = await page.locator('h1').text_content()
            print(f"✅ Main heading: {heading}")
            assert "WebRTC PeerJS Chat" in heading
            
            # Test 3: Wait for peer ID to be generated
            print("⏳ Waiting for peer ID generation...")
            await page.wait_for_function(
                "document.getElementById('my-id').textContent !== 'Connecting...'",
                timeout=10000
            )
            
            peer_id = await page.locator('#my-id').text_content()
            print(f"✅ Peer ID generated: {peer_id}")
            assert len(peer_id) == 16, f"Expected 16-character peer ID, got {len(peer_id)} characters"
            
            # Test 4: Check that send button is initially disabled
            send_btn = page.locator('#send-btn')
            is_disabled = await send_btn.is_disabled()
            print(f"✅ Send button initially disabled: {is_disabled}")
            assert is_disabled, "Send button should be disabled initially"
            
            # Test 5: Test peer ID input
            peer_input = page.locator('#peer-id-input')
            await peer_input.fill('test-peer-id')
            input_value = await peer_input.input_value()
            print(f"✅ Peer input works: {input_value}")
            assert input_value == 'test-peer-id'
            
            # Test 6: Test message input
            message_input = page.locator('#message-input')
            await message_input.fill('Hello, World!')
            message_value = await message_input.input_value()
            print(f"✅ Message input works: {message_value}")
            assert message_value == 'Hello, World!'
            
            # Test 7: Check test results section
            await page.wait_for_selector('#test-output', timeout=5000)
            test_output = await page.locator('#test-output').text_content()
            print(f"✅ Test framework running: {len(test_output)} characters of test output")
            
            # Test 8: Take screenshot
            await page.screenshot(path='deployment_test.png')
            print("✅ Screenshot saved as deployment_test.png")
            
            # Test 9: Check for JavaScript errors
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            
            # Wait a bit to catch any errors
            await asyncio.sleep(2)
            
            if errors:
                print(f"⚠️  JavaScript errors detected: {len(errors)}")
                for error in errors:
                    print(f"   - {error}")
            else:
                print("✅ No JavaScript errors detected")
            
            # Test 10: Check network requests
            responses = []
            page.on('response', lambda response: responses.append(response))
            
            # Reload to capture network requests
            await page.reload()
            await page.wait_for_load_state('networkidle')
            
            print(f"✅ Network requests: {len(responses)} total")
            for response in responses:
                if response.status >= 400:
                    print(f"   ❌ Failed: {response.url} - {response.status}")
                else:
                    print(f"   ✅ Success: {response.url} - {response.status}")
            
            print("\n🎉 All deployment tests passed!")
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            await page.screenshot(path='deployment_error.png')
            raise
        
        finally:
            await browser.close()

if __name__ == "__main__":
    # Install playwright if needed
    import subprocess
    import sys
    
    try:
        import playwright
    except ImportError:
        print("Installing playwright...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright"])
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        import playwright
    
    asyncio.run(test_deployment())