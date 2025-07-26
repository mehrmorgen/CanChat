#!/usr/bin/env python3
"""
Deployment and Testing Workflow
Waits 30 seconds after deployment then runs comprehensive tests
"""

import time
import subprocess
import sys
from datetime import datetime
import json

def log_message(message, level="INFO"):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

def run_command(command, description):
    """Run a command and return success status"""
    log_message(f"Running: {description}")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=60)
        if result.returncode == 0:
            log_message(f"✅ {description} - SUCCESS")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            log_message(f"❌ {description} - FAILED", "ERROR")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
            return False
    except subprocess.TimeoutExpired:
        log_message(f"⏰ {description} - TIMEOUT", "ERROR")
        return False
    except Exception as e:
        log_message(f"💥 {description} - EXCEPTION: {e}", "ERROR")
        return False

def wait_for_deployment(seconds=30):
    """Wait for GitHub Pages deployment to propagate"""
    log_message(f"⏳ Waiting {seconds} seconds for GitHub Pages deployment to propagate...")
    
    for i in range(seconds, 0, -1):
        if i % 10 == 0 or i <= 5:
            log_message(f"   {i} seconds remaining...")
        time.sleep(1)
    
    log_message("✅ Wait complete - deployment should be live!")

def test_deployment():
    """Run comprehensive deployment tests"""
    log_message("🚀 Starting deployment validation tests")
    
    tests = [
        {
            "command": "python3 test_deployment_simple.py",
            "description": "Simple HTTP validation test",
            "critical": True
        },
        {
            "command": "python3 test_deployment_uvx.py",
            "description": "Comprehensive uvx/playwright test",
            "critical": True
        },
        {
            "command": "uvx --from playwright playwright screenshot https://mehrmorgen.github.io/CanChat/chat.html post_deploy_test.png",
            "description": "Post-deployment screenshot",
            "critical": False
        }
    ]
    
    results = []
    
    for test in tests:
        success = run_command(test["command"], test["description"])
        results.append({
            "test": test["description"],
            "success": success,
            "critical": test["critical"]
        })
        
        if not success and test["critical"]:
            log_message(f"💥 Critical test failed: {test['description']}", "ERROR")
        
        # Small delay between tests
        time.sleep(2)
    
    return results

def generate_test_report(results):
    """Generate a test report"""
    log_message("📊 Generating test report")
    
    total_tests = len(results)
    passed_tests = sum(1 for r in results if r["success"])
    failed_tests = total_tests - passed_tests
    critical_failures = sum(1 for r in results if not r["success"] and r["critical"])
    
    print("\n" + "="*60)
    print("🔍 DEPLOYMENT TEST REPORT")
    print("="*60)
    print(f"Total Tests: {total_tests}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    print(f"💥 Critical Failures: {critical_failures}")
    print()
    
    for result in results:
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        critical = " (CRITICAL)" if result["critical"] else ""
        print(f"{status} {result['test']}{critical}")
    
    print("="*60)
    
    if critical_failures == 0:
        print("🎉 ALL CRITICAL TESTS PASSED - Deployment is successful!")
        return True
    else:
        print("💥 CRITICAL TESTS FAILED - Deployment has issues!")
        return False

def main():
    """Main deployment and testing workflow"""
    log_message("🚀 Starting deployment and testing workflow")
    
    # Wait for deployment to propagate
    wait_for_deployment(30)
    
    # Run tests
    results = test_deployment()
    
    # Generate report
    success = generate_test_report(results)
    
    # Final status
    if success:
        log_message("🎊 Deployment and testing completed successfully!")
        sys.exit(0)
    else:
        log_message("💥 Deployment testing failed!", "ERROR")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log_message("⚠️ Testing interrupted by user", "WARN")
        sys.exit(1)
    except Exception as e:
        log_message(f"💥 Unexpected error: {e}", "ERROR")
        sys.exit(1)