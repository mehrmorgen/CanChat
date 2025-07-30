# Manual Testing Guide for WebRTC Chat Application

## Prerequisites
- Development server running: `bun run dev`
- Two browser windows/tabs available
- Modern browser (Chrome, Firefox, Safari latest versions)

## Test Scenario 1: Peer-to-Peer Connection (Requirements 4.1, 4.2)

### Steps:
1. **Open First Browser Instance**
   - Navigate to `http://localhost:3000/chat.html`
   - Wait for "Your Peer ID" section to show a generated ID (not "Connecting...")
   - Note the peer ID (e.g., "abc123def456")
   - Verify status shows "Disconnected" with red indicator

2. **Open Second Browser Instance**
   - Open new tab/window to `http://localhost:3000/chat.html`
   - Wait for peer ID generation
   - Note this second peer ID is different from the first

3. **Establish Connection**
   - In second browser: paste first browser's peer ID into "Connect to Peer" input
   - Click "Connect" button
   - **Expected Results:**
     - Status indicator changes to green "Connected"
     - Status text shows "Connected to [peer-id]"
     - Send button becomes enabled
     - Both browsers show connection established

### Success Criteria:
- ✅ Peer IDs generated successfully
- ✅ Connection established between browsers
- ✅ Status indicators update correctly
- ✅ UI elements enable/disable appropriately

## Test Scenario 2: Message Exchange (Requirements 4.2, 4.3)

### Steps:
1. **Send Message from First Browser**
   - Type "Hello from Browser 1" in message input
   - Click "Send" or press Enter
   - **Expected Results:**
     - Message appears in first browser's chat log as "Me: Hello from Browser 1"
     - Message appears in second browser's chat log as "Peer: Hello from Browser 1"
     - Message input clears after sending
     - Chat log auto-scrolls to bottom

2. **Send Reply from Second Browser**
   - Type "Hello back from Browser 2" in message input
   - Send the message
   - **Expected Results:**
     - Message appears in second browser as "Me: Hello back from Browser 2"
     - Message appears in first browser as "Peer: Hello back from Browser 2"
     - Real-time delivery (no noticeable delay)

3. **Test Multiple Messages**
   - Send several messages back and forth
   - Verify message order is preserved
   - Verify timestamps are accurate
   - Test empty messages (should be prevented)

### Success Criteria:
- ✅ Messages delivered in real-time
- ✅ Correct sender identification (Me vs Peer)
- ✅ Message order preserved
- ✅ Auto-scroll functionality works
- ✅ Input validation prevents empty messages

## Test Scenario 3: WebRTC Functionality Verification (Requirement 4.3)

### Steps:
1. **Open Browser Developer Tools**
   - Press F12 or right-click → Inspect
   - Go to Console tab
   - Look for any JavaScript errors

2. **Verify WebRTC Connection**
   - In Console, check for PeerJS connection logs
   - Should see successful DataChannel establishment
   - No WebRTC-related errors

3. **Test Connection Resilience**
   - Refresh one browser tab
   - Verify connection re-establishes
   - Test network interruption simulation (if possible)

### Success Criteria:
- ✅ No JavaScript errors in console
- ✅ WebRTC DataChannel established successfully
- ✅ PeerJS library loads and functions correctly
- ✅ Connection handles basic network issues

## Test Scenario 4: Responsive Design and Mobile Compatibility (Requirement 4.4)

### Steps:
1. **Desktop Responsive Testing**
   - Resize browser window to different widths
   - Test at: 1920px, 1024px, 768px, 480px, 320px
   - Verify layout adapts appropriately
   - Check that all elements remain accessible

2. **Mobile Device Testing** (if available)
   - Open application on mobile device
   - Test portrait and landscape orientations
   - Verify touch interactions work
   - Check text input and button functionality

3. **Browser Developer Tools Mobile Simulation**
   - Open DevTools (F12)
   - Click device simulation icon
   - Test various device presets (iPhone, Android, iPad)
   - Verify responsive breakpoints

### Success Criteria:
- ✅ Layout adapts to different screen sizes
- ✅ All functionality works on mobile devices
- ✅ Touch interactions are responsive
- ✅ Text remains readable at all sizes
- ✅ Buttons are appropriately sized for touch

## Test Scenario 5: Error Handling and Edge Cases

### Steps:
1. **Invalid Peer ID Testing**
   - Try connecting with invalid peer ID (e.g., "invalid-id")
   - Verify appropriate error message
   - Ensure application doesn't crash

2. **Connection Failure Testing**
   - Try connecting to non-existent peer ID
   - Verify timeout handling
   - Check error message display

3. **Browser Compatibility**
   - Test in Chrome, Firefox, Safari (if available)
   - Verify consistent behavior across browsers

### Success Criteria:
- ✅ Graceful error handling
- ✅ Appropriate user feedback for errors
- ✅ Application stability maintained
- ✅ Cross-browser compatibility

## Verification Checklist

### Requirement 4.1: Peer Connection Exchange
- [ ] Two browser contexts can exchange peer IDs
- [ ] Connection establishment works reliably
- [ ] Status indicators update correctly

### Requirement 4.2: DataChannel Chat Functionality
- [ ] Messages send and receive in real-time
- [ ] Message formatting is correct
- [ ] Chat log updates properly

### Requirement 4.3: WebRTC Functionality Without Regression
- [ ] All original WebRTC features work
- [ ] No new errors introduced
- [ ] Performance is maintained or improved

### Requirement 4.4: Responsive Design and Mobile Compatibility
- [ ] Layout adapts to different screen sizes
- [ ] Mobile devices can use the application
- [ ] Touch interactions work properly

## Expected Test Results

If all tests pass, you should observe:
- ✅ Fast application loading (sub-100ms server startup)
- ✅ Clean, modern UI with responsive design
- ✅ Reliable peer-to-peer connections
- ✅ Real-time message delivery
- ✅ No JavaScript errors in console
- ✅ Consistent behavior across browsers
- ✅ Mobile-friendly interface

## Troubleshooting

If tests fail:
1. Check browser console for JavaScript errors
2. Verify development server is running (`bun run dev`)
3. Ensure modern browser is being used
4. Check network connectivity
5. Try refreshing both browser instances
6. Verify HTTPS is used if testing WebRTC features

## Test Completion

Once all manual tests pass, the comprehensive smoke testing for task 10 is complete, and all requirements (4.1, 4.2, 4.3, 4.4) have been verified.