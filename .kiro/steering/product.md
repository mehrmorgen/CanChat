# Product Overview

## WebRTC PeerJS Chat

A minimal peer-to-peer text chat application that enables direct browser-to-browser communication using WebRTC technology. The application allows two users to connect using unique peer IDs and exchange messages in real-time without requiring a central server for message relay.

## Key Features

- **Direct P2P Communication**: Messages flow directly between browsers after connection establishment
- **No Server Dependencies**: Uses PeerJS cloud signaling and Google STUN servers for connection setup
- **Single File Application**: Entirely self-contained HTML file with no build process required
- **Real-time Messaging**: Instant message delivery between connected peers
- **Simple Interface**: Clean, minimal UI focused on core chat functionality

## Target Use Cases

- Quick peer-to-peer communication without account creation
- Educational demonstrations of WebRTC technology
- Temporary chat sessions between known parties
- Development and testing of WebRTC concepts

## Technical Approach

The application follows Test-Driven Development (TDD) methodology with comprehensive unit and integration testing. Built exclusively for modern browsers, it leverages native WebRTC APIs and ES2020+ JavaScript features without polyfills or transpilation. All functionality is contained within a single HTML file for maximum portability and ease of deployment.