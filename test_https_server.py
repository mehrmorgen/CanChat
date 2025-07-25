#!/usr/bin/env python3
"""
Simple HTTPS server for testing WebRTC functionality locally.
This script creates a self-signed certificate and serves the chat.html file over HTTPS.
"""

import http.server
import ssl
import socketserver
import os
import subprocess
import sys

def create_self_signed_cert():
    """Create a self-signed certificate for local HTTPS testing."""
    cert_file = "localhost.crt"
    key_file = "localhost.key"
    
    if os.path.exists(cert_file) and os.path.exists(key_file):
        print("✅ Certificate files already exist.")
        return cert_file, key_file
    
    print("🔧 Creating self-signed certificate for HTTPS testing...")
    
    try:
        # Create self-signed certificate
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:2048", 
            "-keyout", key_file, "-out", cert_file, "-days", "30", "-nodes",
            "-subj", "/CN=localhost"
        ], check=True, capture_output=True)
        
        print("✅ Self-signed certificate created successfully.")
        print("🔒 Certificate files are temporary and excluded from git for security.")
        return cert_file, key_file
        
    except subprocess.CalledProcessError as e:
        print("❌ Failed to create certificate. OpenSSL may not be installed.")
        print("💡 Install OpenSSL or use a different HTTPS testing method.")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ OpenSSL not found. Please install OpenSSL to create certificates.")
        print("💡 On macOS: brew install openssl")
        print("💡 On Ubuntu: sudo apt-get install openssl")
        sys.exit(1)

def start_https_server(port=8443):
    """Start HTTPS server for testing."""
    cert_file, key_file = create_self_signed_cert()
    
    # Create SSL context
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(cert_file, key_file)
    
    # Create server
    handler = http.server.SimpleHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        print(f"🚀 HTTPS Server started on port {port}")
        print(f"🌐 Access the chat application at: https://localhost:{port}/chat.html")
        print("⚠️  You'll need to accept the self-signed certificate warning in your browser.")
        print("💡 This is normal for local testing - production uses proper certificates.")
        print("🛑 Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid port number. Using default port 8443.")
            port = 8443
    else:
        port = 8443
    
    print("🔒 HTTPS Test Server for WebRTC PeerJS Chat")
    print("=" * 50)
    start_https_server(port)