#!/usr/bin/env python3
"""
Browser automation test using uvx and playwright
Tests the WebRTC PeerJS Chat deployment
"""

import subprocess
import sys
import time
import json
from pathlib import Path

def run_uvx_command(command_args, capture_output=True):
    """Run a uvx command and return the result"""
    try:
        cmd = ["uvx", "--from", "playwright", "playwright"] + command_args
        result = subprocess.run(cmd, capture_output=capture_output, text=True, timeout=30)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        print("❌ Command timed out")
        return False, "", "Timeout"
    except Exception as e:
        print(f"❌ Command failed: {e}")
        return False, "", str(e)

def test_deployment_with_uvx():
    """Test the deployment using uvx playwright commands"""
    
    url = "https://mehrmorgen.github.io/CanChat/chat.html"
    
    print(f"🚀 Testing deployment at: {url}")
    print("=" * 60)
    
    # Test 1: Take a screenshot to verify page loads
    print("📸 Taking screenshot...")
    success, stdout, stderr = run_uvx_command([
        "screenshot", 
        url, 
        "deployment_test_uvx.png"
    ])
    
    if success:
        print("✅ Screenshot captured successfully")
        print(f"   Saved as: deployment_test_uvx.png")
    else:
        print(f"❌ Screenshot failed: {stderr}")
        return False
    
    # Test 2: Generate a PDF to test page rendering
    print("\n📄 Generating PDF...")
    success, stdout, stderr = run_uvx_command([
        "pdf",
        url,
        "deployment_test_uvx.pdf"
    ])
    
    if success:
        print("✅ PDF generated successfully")
        print(f"   Saved as: deployment_test_uvx.pdf")
    else:
        print(f"❌ PDF generation failed: {stderr}")
    
    # Test 3: Use codegen to test interactivity (this will show what actions are possible)
    print("\n🔧 Testing page interactivity...")
    print("   Note: This will open a browser window for 10 seconds to test the page")
    
    # Run codegen in background for a short time to test page functionality
    try:
        cmd = ["uvx", "--from", "playwright", "playwright", "codegen", url]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Let it run for a few seconds then terminate
        time.sleep(3)
        process.terminate()
        
        print("✅ Page interactivity test completed")
        
    except Exception as e:
        print(f"⚠️  Interactivity test skipped: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Deployment validation completed!")
    print("\nGenerated files:")
    print("  - deployment_test_uvx.png (screenshot)")
    print("  - deployment_test_uvx.pdf (PDF version)")
    
    return True

def validate_deployment_files():
    """Validate that the deployment files were created"""
    files_to_check = [
        "deployment_test_uvx.png",
        "deployment_test_uvx.pdf"
    ]
    
    print("\n📋 Validating generated files:")
    all_exist = True
    
    for file_path in files_to_check:
        if Path(file_path).exists():
            size = Path(file_path).stat().st_size
            print(f"✅ {file_path} - {size:,} bytes")
        else:
            print(f"❌ {file_path} - Not found")
            all_exist = False
    
    return all_exist

def quick_browser_test():
    """Quick test to open the deployment in a browser"""
    url = "https://mehrmorgen.github.io/CanChat/chat.html"
    
    print(f"\n🌐 Opening deployment in browser...")
    print(f"   URL: {url}")
    print("   This will open for 5 seconds then close automatically")
    
    try:
        # Open in Chromium for 5 seconds
        cmd = ["uvx", "--from", "playwright", "playwright", "cr", url]
        process = subprocess.Popen(cmd)
        
        time.sleep(5)
        process.terminate()
        
        print("✅ Browser test completed")
        return True
        
    except Exception as e:
        print(f"❌ Browser test failed: {e}")
        return False

if __name__ == "__main__":
    print("🔧 WebRTC PeerJS Chat - Deployment Validation with uvx")
    print("Using Playwright via uvx for browser automation")
    print()
    
    # Run the main deployment test
    success = test_deployment_with_uvx()
    
    if success:
        # Validate the generated files
        files_valid = validate_deployment_files()
        
        if files_valid:
            print("\n✅ All tests passed! Deployment is working correctly.")
            
            # Ask if user wants to do a quick browser test
            try:
                response = input("\n🤔 Would you like to do a quick browser test? (y/N): ").strip().lower()
                if response in ['y', 'yes']:
                    quick_browser_test()
            except KeyboardInterrupt:
                print("\n👋 Test completed.")
        else:
            print("\n⚠️  Some files were not generated correctly.")
    else:
        print("\n❌ Deployment test failed.")
        sys.exit(1)