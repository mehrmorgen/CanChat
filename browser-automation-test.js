#!/usr/bin/env bun
import { chromium } from 'playwright';

async function testChatApplication() {
  console.log('🚀 Starting browser automation test...');
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for headless mode
    slowMo: 1000 // Slow down actions for visibility
  });
  
  try {
    // Create two browser contexts (simulating two users)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Navigate both pages to the chat application
    console.log('📱 Opening chat application in two browser tabs...');
    await Promise.all([
      page1.goto('http://localhost:3000'),
      page2.goto('http://localhost:3000')
    ]);
    
    // Wait for pages to load
    await Promise.all([
      page1.waitForSelector('#my-id'),
      page2.waitForSelector('#my-id')
    ]);
    
    // Get the peer IDs from both pages
    console.log('🔍 Getting peer IDs...');
    const peerId1 = await page1.locator('#my-id').textContent();
    const peerId2 = await page2.locator('#my-id').textContent();
    
    console.log(`User 1 ID: ${peerId1}`);
    console.log(`User 2 ID: ${peerId2}`);
    
    // Wait for peer IDs to be generated (not "Connecting...")
    console.log('⏳ Waiting for peer connections to initialize...');
    await page1.waitForFunction(() => {
      const myId = document.querySelector('#my-id').textContent;
      return myId && myId !== 'Connecting...';
    }, { timeout: 10000 });
    
    await page2.waitForFunction(() => {
      const myId = document.querySelector('#my-id').textContent;
      return myId && myId !== 'Connecting...';
    }, { timeout: 10000 });
    
    // Get the actual peer IDs after initialization
    const actualPeerId1 = await page1.locator('#my-id').textContent();
    const actualPeerId2 = await page2.locator('#my-id').textContent();
    
    console.log(`User 1 actual ID: ${actualPeerId1}`);
    console.log(`User 2 actual ID: ${actualPeerId2}`);
    
    // Connect User 1 to User 2
    console.log('🔗 Connecting User 1 to User 2...');
    await page1.fill('#peer-id-input', actualPeerId2);
    await page1.click('#connect-btn');
    
    // Wait for connection to be established (send button should be enabled)
    console.log('⏳ Waiting for connection to establish...');
    await page1.waitForSelector('#send-btn:not([disabled])', { timeout: 10000 });
    
    // Send a message from User 1
    console.log('💬 Sending message from User 1...');
    await page1.fill('#message-input', 'Hello from User 1!');
    await page1.click('#send-btn');
    
    // Wait for message to appear
    await page1.waitForTimeout(1000);
    
    // Check if message appears in User 2's chat
    console.log('✅ Checking if message appears in User 2 chat...');
    const messagesUser2 = await page2.locator('#messages').textContent();
    
    if (messagesUser2.includes('Hello from User 1!')) {
      console.log('✅ SUCCESS: Message received by User 2!');
    } else {
      console.log('❌ FAILED: Message not received by User 2');
      console.log('User 2 messages:', messagesUser2);
    }
    
    // Send a reply from User 2
    console.log('💬 Sending reply from User 2...');
    await page2.fill('#message-input', 'Hello back from User 2!');
    await page2.click('#send-btn');
    
    await page2.waitForTimeout(1000);
    
    // Check if reply appears in User 1's chat
    const messagesUser1 = await page1.locator('#messages').textContent();
    
    if (messagesUser1.includes('Hello back from User 2!')) {
      console.log('✅ SUCCESS: Reply received by User 1!');
    } else {
      console.log('❌ FAILED: Reply not received by User 1');
      console.log('User 1 messages:', messagesUser1);
    }
    
    // Take screenshots for verification
    console.log('📸 Taking screenshots...');
    await page1.screenshot({ path: 'user1-chat.png' });
    await page2.screenshot({ path: 'user2-chat.png' });
    
    console.log('🎉 Browser automation test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testChatApplication().catch(console.error);