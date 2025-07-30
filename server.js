/**
 * Simple Bun development server for WebRTC Chat
 */

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;
    
    // Default to chat.html
    if (filePath === '/') {
      filePath = '/chat.html';
    }
    
    // Remove leading slash for file system
    const file = Bun.file('.' + filePath);
    
    // Check if file exists
    const exists = await file.exists();
    if (!exists) {
      return new Response('File not found', { status: 404 });
    }
    
    // Set appropriate content type
    const ext = filePath.split('.').pop();
    const contentTypes = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json'
    };
    
    const headers = {
      'Content-Type': contentTypes[ext] || 'text/plain'
    };
    
    return new Response(file, { headers });
  },
});

console.log(`🚀 Development server running at http://localhost:${server.port}/`);