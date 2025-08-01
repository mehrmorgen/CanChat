/**
 * HTTPS Bun development server for WebRTC Chat
 * 
 * This server provides HTTPS functionality required for WebRTC to work properly.
 * It uses existing certificate files (localhost.crt and localhost.key) for HTTPS.
 */

import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Check if certificate files exist
const certFile = 'localhost.crt';
const keyFile = 'localhost.key';

if (!existsSync(certFile) || !existsSync(keyFile)) {
  console.error('❌ Certificate files not found. Please generate them first.');
  console.error('💡 You can use OpenSSL to generate self-signed certificates:');
  console.error('openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj "/CN=localhost"');
  process.exit(1);
}

// Read certificate files
const cert = readFileSync(certFile);
const key = readFileSync(keyFile);

// Default port for HTTPS
const port = 8443;

// Create HTTPS server
const server = Bun.serve({
  port: port,
  tls: {
    cert: cert,
    key: key,
  },
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

console.log('🔒 HTTPS Test Server for WebRTC PeerJS Chat');
console.log('=' + '='.repeat(49));
console.log(`🚀 HTTPS Server started on port ${port}`);
console.log(`🌐 Access the chat application at: https://localhost:${port}/chat.html`);
console.log('⚠️  You\'ll need to accept the self-signed certificate warning in your browser.');
console.log('💡 This is normal for local testing - production uses proper certificates.');
console.log('🛑 Press Ctrl+C to stop the server');