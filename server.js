/**
 * Bun development servers for WebRTC Chat
 *
 * - HTTPS on 8443 (required for full WebRTC functionality)
 * - HTTP on 3000 (for compatibility with helper scripts; some WebRTC APIs may be limited)
 */

import { readFileSync, existsSync } from 'node:fs';

// Static file handler shared by both servers
async function staticFetch(req) {
  const url = new URL(req.url);
  let filePath = url.pathname;

  // Default to chat.html
  if (filePath === '/') {
    filePath = '/chat.html';
  }

  const file = Bun.file('.' + filePath);
  const exists = await file.exists();
  if (!exists) {
    return new Response('File not found', { status: 404 });
  }

  const ext = filePath.split('.').pop();
  const contentTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json'
  };

  const headers = { 'Content-Type': contentTypes[ext] || 'text/plain' };
  return new Response(file, { headers });
}

// HTTPS (requires certs)
const HTTPS_PORT = 8443;
const certFile = 'localhost.crt';
const keyFile = 'localhost.key';
let httpsServer = null;

if (existsSync(certFile) && existsSync(keyFile)) {
  const cert = readFileSync(certFile);
  const key = readFileSync(keyFile);

  httpsServer = Bun.serve({
    port: HTTPS_PORT,
    tls: { cert, key },
    fetch: staticFetch,
  });

  console.log('🔒 HTTPS Test Server for WebRTC PeerJS Chat');
  console.log('=================================================');
  console.log(`🚀 HTTPS Server started on port ${HTTPS_PORT}`);
  console.log(`🌐 Access: https://localhost:${HTTPS_PORT}/chat.html`);
  console.log("⚠️  You'll need to accept the self-signed certificate warning in your browser.");
  console.log('💡 This is normal for local testing - production uses proper certificates.');
} else {
  console.warn('⚠️ HTTPS certificates not found. Skipping HTTPS server.');
  console.warn('   Generate with: openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj "/CN=localhost"');
}

// HTTP (compatibility server)
const HTTP_PORT = 3000;
const httpServer = Bun.serve({
  port: HTTP_PORT,
  fetch: staticFetch,
});

console.log('🟢 HTTP Server for compatibility with helper scripts');
console.log('=================================================');
console.log(`🚀 HTTP Server started on port ${HTTP_PORT}`);
console.log(`🌐 Access: http://localhost:${HTTP_PORT}/chat.html`);
console.log('💡 Note: Some WebRTC features require HTTPS; use the HTTPS URL above for full functionality.');
console.log('🛑 Press Ctrl+C to stop the servers');