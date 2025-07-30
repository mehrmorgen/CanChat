#!/usr/bin/env bun

import { chromium } from 'playwright';

async function debugNetworkRequests() {
    console.log('🔍 Debugging network requests...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Track all network requests
    page.on('request', request => {
        console.log('📤 Request:', request.method(), request.url());
    });
    
    page.on('response', response => {
        const status = response.status();
        const url = response.url();
        if (status >= 400) {
            console.log('❌ Failed:', status, url);
        } else {
            console.log('✅ Success:', status, url);
        }
    });
    
    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugNetworkRequests().catch(console.error);