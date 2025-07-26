#!/usr/bin/env python3
"""
Quick deployment test - optimized for speed and reliability
"""

import subprocess
import time
from datetime import datetime

def log(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def main():
    log("🚀 Quick deployment validation starting...")
    
    # Wait 30 seconds for deployment
    log("⏳ Waiting 30 seconds for GitHub Pages deployment...")
    time.sleep(30)
    
    # Test 1: Simple HTTP check
    log("📡 Testing HTTP connectivity...")
    result = subprocess.run(["python3", "test_deployment_simple.py"], 
                          capture_output=True, text=True, timeout=30)
    
    if result.returncode == 0:
        log("✅ HTTP test PASSED")
    else:
        log("❌ HTTP test FAILED")
        return False
    
    # Test 2: Screenshot test
    log("📸 Taking deployment screenshot...")
    result = subprocess.run([
        "uvx", "--from", "playwright", "playwright", "screenshot",
        "https://mehrmorgen.github.io/CanChat/chat.html",
        "deployment_validation.png"
    ], capture_output=True, text=True, timeout=30)
    
    if result.returncode == 0:
        log("✅ Screenshot test PASSED")
        log("📁 Screenshot saved as: deployment_validation.png")
    else:
        log("❌ Screenshot test FAILED")
        return False
    
    log("🎉 All tests PASSED! Deployment is successful!")
    return True

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except Exception as e:
        log(f"💥 Error: {e}")
        exit(1)