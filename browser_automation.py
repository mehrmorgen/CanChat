#!/usr/bin/env python3
"""
Browser automation script for testing the WebRTC chat deployment
Alternative to MCP browser automation servers
"""

import asyncio
import sys
import json
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("❌ Playwright not installed. Install with: pip install playwright")
    print("   Then run: playwright install chromium")
    sys.exit(1)

class BrowserAutomation:
    def __init__(self):
        self.browser = None
        self.context = None
        self.page = None
    
    async def create_session(self, headless=True, viewport_width=1280, viewport_height=720):
        """Create a new browser session"""
        try:
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.launch(headless=headless)
            self.context = await self.browser.new_context(
                viewport={'width': viewport_width, 'height': viewport_height}
            )
            self.page = await self.context.new_page()
            print(f"✅ Browser session created (headless={headless})")
            return True
        except Exception as e:
            print(f"❌ Failed to create browser session: {e}")
            return False
    
    async def navigate_to_url(self, url, wait_until='domcontentloaded'):
        """Navigate to a URL"""
        if not self.page:
            print("❌ No browser session active")
            return False
        
        try:
            await self.page.goto(url, wait_until=wait_until)
            print(f"✅ Navigated to: {url}")
            return True
        except Exception as e:
            print(f"❌ Failed to navigate to {url}: {e}")
            return False
    
    async def take_screenshot(self, path=None, full_page=False):
        """Take a screenshot"""
        if not self.page:
            print("❌ No browser session active")
            return False
        
        try:
            if not path:
                path = f"screenshot_{int(asyncio.get_event_loop().time())}.png"
            
            await self.page.screenshot(path=path, full_page=full_page)
            print(f"✅ Screenshot saved: {path}")
            return path
        except Exception as e:
            print(f"❌ Failed to take screenshot: {e}")
            return False
    
    async def get_page_title(self):
        """Get the page title"""
        if not self.page:
            print("❌ No browser session active")
            return None
        
        try:
            title = await self.page.title()
            print(f"✅ Page title: {title}")
            return title
        except Exception as e:
            print(f"❌ Failed to get page title: {e}")
            return None
    
    async def get_page_url(self):
        """Get the current page URL"""
        if not self.page:
            print("❌ No browser session active")
            return None
        
        try:
            url = self.page.url
            print(f"✅ Current URL: {url}")
            return url
        except Exception as e:
            print(f"❌ Failed to get page URL: {e}")
            return None
    
    async def click_element(self, selector, timeout=30000):
        """Click an element"""
        if not self.page:
            print("❌ No browser session active")
            return False
        
        try:
            await self.page.click(selector, timeout=timeout)
            print(f"✅ Clicked element: {selector}")
            return True
        except Exception as e:
            print(f"❌ Failed to click {selector}: {e}")
            return False
    
    async def fill_input(self, selector, text, timeout=30000):
        """Fill an input field"""
        if not self.page:
            print("❌ No browser session active")
            return False
        
        try:
            await self.page.fill(selector, text, timeout=timeout)
            print(f"✅ Filled input {selector} with: {text}")
            return True
        except Exception as e:
            print(f"❌ Failed to fill {selector}: {e}")
            return False
    
    async def get_text_content(self, selector, timeout=30000):
        """Get text content of an element"""
        if not self.page:
            print("❌ No browser session active")
            return None
        
        try:
            text = await self.page.text_content(selector, timeout=timeout)
            print(f"✅ Text content of {selector}: {text}")
            return text
        except Exception as e:
            print(f"❌ Failed to get text content of {selector}: {e}")
            return None
    
    async def wait_for_selector(self, selector, timeout=30000):
        """Wait for a selector to appear"""
        if not self.page:
            print("❌ No browser session active")
            return False
        
        try:
            await self.page.wait_for_selector(selector, timeout=timeout)
            print(f"✅ Selector appeared: {selector}")
            return True
        except Exception as e:
            print(f"❌ Selector {selector} did not appear: {e}")
            return False
    
    async def execute_javascript(self, code):
        """Execute JavaScript code"""
        if not self.page:
            print("❌ No browser session active")
            return None
        
        try:
            result = await self.page.evaluate(code)
            print(f"✅ JavaScript executed successfully")
            return result
        except Exception as e:
            print(f"❌ Failed to execute JavaScript: {e}")
            return None
    
    async def close_session(self):
        """Close the browser session"""
        try:
            if self.browser:
                await self.browser.close()
                print("✅ Browser session closed")
            return True
        except Exception as e:
            print(f"❌ Failed to close browser session: {e}")
            return False

async def test_deployment():
    """Test the WebRTC chat deployment"""
    automation = BrowserAutomation()
    
    try:
        # Create browser session
        await automation.create_session(headless=False)
        
        # Navigate to deployment
        await automation.navigate_to_url("https://mehrmorgen.github.io/CanChat/chat.html")
        
        # Wait for page to load
        await automation.wait_for_selector('#my-id')
        
        # Get page title
        title = await automation.get_page_title()
        assert title == "WebRTC PeerJS Chat", f"Expected 'WebRTC PeerJS Chat', got '{title}'"
        
        # Wait for peer ID to be generated
        print("⏳ Waiting for peer ID generation...")
        await asyncio.sleep(3)
        
        # Get peer ID
        peer_id = await automation.get_text_content('#my-id')
        print(f"🆔 Generated peer ID: {peer_id}")
        
        # Test peer ID input
        await automation.fill_input('#peer-id-input', 'test-peer-id')
        
        # Test message input
        await automation.fill_input('#message-input', 'Hello, World!')
        
        # Take screenshot
        await automation.take_screenshot('deployment_test.png', full_page=True)
        
        # Check for JavaScript errors
        errors = await automation.execute_javascript("""
            return window.console.errors || [];
        """)
        
        if errors:
            print(f"⚠️ JavaScript errors detected: {errors}")
        else:
            print("✅ No JavaScript errors detected")
        
        print("\n🎉 Deployment test completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        await automation.take_screenshot('deployment_error.png', full_page=True)
        raise
    
    finally:
        await automation.close_session()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        asyncio.run(test_deployment())
    else:
        print("Browser Automation Tool")
        print("Usage:")
        print("  python browser_automation.py test    # Test deployment")
        print("  python browser_automation.py         # Show this help")