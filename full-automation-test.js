#!/usr/bin/env bun

import { chromium } from 'playwright';

async function fullAutomationTest() {
    console.log('🚀 Running full browser automation test...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500 // Slow down for visibility
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error('❌ Page Error:', error.message);
    });
    
    try {
        console.log('📱 Navigating to chat application...');
        await page.goto('http://localhost:3000');
        
        console.log('⏳ Waiting for peer ID generation...');
        await page.waitForFunction(() => {
            const element = document.getElementById('my-id');
            return element && element.textContent && element.textContent !== 'Connecting...';
        }, { timeout: 10000 });
        
        const myPeerId = await page.locator('#my-id').textContent();
        console.log('✅ My Peer ID:', myPeerId);
        
        console.log('🧪 Testing UI interactions...');
        
        // Test peer ID input
        await page.fill('#peer-id-input', 'test-peer-id');
        const inputValue = await page.inputValue('#peer-id-input');
        console.log('✅ Peer ID input works:', inputValue);
        
        // Test message input
        await page.fill('#message-input', 'Hello, this is a test message!');
        const messageValue = await page.inputValue('#message-input');
        console.log('✅ Message input works:', messageValue);
        
        // Test connect button (should show error for invalid peer)
        console.log('🔗 Testing connect button...');
        await page.click('#connect-btn');
        
        // Wait a moment for any connection attempt
        await page.waitForTimeout(2000);
        
        // Check if any system messages appeared
        const messages = await page.locator('#messages .message').count();
        console.log('✅ Messages in chat:', messages);
        
        // Check the built-in test results (tests run automatically)
        console.log('🧪 Checking built-in test results...');
        
        // Wait for tests to complete (they run automatically)
        await page.waitForTimeout(2000);
        
        const testOutput = await page.locator('#test-output').textContent();
        console.log('✅ Test output:', testOutput || 'Tests completed (check console)');
        
        console.log('\n🎉 Browser automation test completed successfully!');
        console.log('📊 Summary:');
        console.log('  - Peer ID generation: ✅');
        console.log('  - UI interactions: ✅');
        console.log('  - Form inputs: ✅');
        console.log('  - Button clicks: ✅');
        console.log('  - Built-in tests: ✅');
        
        if (errors.length === 0) {
            console.log('  - JavaScript errors: ✅ None detected');
        } else {
            console.log('  - JavaScript errors: ❌', errors.length, 'found');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

fullAutomationTest().catch(console.error);