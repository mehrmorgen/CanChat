#!/usr/bin/env bun

import { chromium } from 'playwright';

async function checkBrowserConsole() {
    console.log('🚀 Starting browser automation test...');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true 
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Collect console messages
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
        const message = `[${msg.type()}] ${msg.text()}`;
        consoleMessages.push(message);
        console.log('Console:', message);
        
        if (msg.type() === 'error') {
            errors.push(message);
        }
    });
    
    page.on('pageerror', error => {
        const errorMsg = `Page Error: ${error.message}`;
        errors.push(errorMsg);
        console.error(errorMsg);
    });
    
    try {
        console.log('📱 Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        
        // Wait a bit for any async operations
        await page.waitForTimeout(3000);
        
        console.log('\n📊 Console Messages:');
        consoleMessages.forEach(msg => console.log('  ', msg));
        
        console.log('\n❌ Errors Found:');
        if (errors.length === 0) {
            console.log('  ✅ No errors detected!');
        } else {
            errors.forEach(error => console.log('  ', error));
        }
        
        // Test basic functionality
        console.log('\n🧪 Testing basic functionality...');
        
        // Check if peer ID is generated
        const peerIdElement = await page.locator('#my-id').textContent();
        console.log('  Peer ID:', peerIdElement || 'Not found');
        
        // Check if connect button exists
        const connectButton = await page.locator('#connect-btn').isVisible();
        console.log('  Connect button visible:', connectButton);
        
        // Check if message input exists
        const messageInput = await page.locator('#message-input').isVisible();
        console.log('  Message input visible:', messageInput);
        
        console.log('\n✅ Browser automation test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

checkBrowserConsole().catch(console.error);