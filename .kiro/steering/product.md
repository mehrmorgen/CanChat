# Product Overview

## WebRTC PeerJS Chat

A minimal peer-to-peer text chat application that enables direct browser-to-browser communication using WebRTC technology. The application allows two users to connect using unique peer IDs and exchange messages in real-time without requiring a central server for message relay.

## Key Features

- **Direct P2P Communication**: Messages flow directly between browsers after connection establishment
- **No Server Dependencies**: Uses PeerJS cloud signaling and Google STUN servers for connection setup
- **Modular ESM Architecture**: Clean separation of concerns with native ES modules
- **Fast Development Environment**: Bun-powered development server with sub-100ms startup
- **Real-time Messaging**: Instant message delivery between connected peers
- **Simple Interface**: Clean, minimal UI focused on core chat functionality

## Target Use Cases

- Quick peer-to-peer communication without account creation
- Educational demonstrations of WebRTC technology
- Temporary chat sessions between known parties
- Development and testing of WebRTC concepts

## Technical Approach

The application follows Test-Driven Development (TDD) methodology with comprehensive unit and integration testing using Bun's native test runner. Built exclusively for modern browsers, it leverages native WebRTC APIs, ES2020+ JavaScript features, and ESM modules without polyfills or transpilation. The modular architecture separates concerns while maintaining simplicity and fast development cycles through Bun's optimized runtime.