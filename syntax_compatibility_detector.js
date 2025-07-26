/**
 * Enhanced Syntax Compatibility Detection System
 * Provides better user feedback for legacy browsers
 */

// This code must use only ES5 syntax to work in legacy browsers
(function() {
    'use strict';
    
    // Browser detection using ES5-compatible code
    function getBrowserInfo() {
        var userAgent = navigator.userAgent;
        var browsers = [
            {
                name: 'Chrome',
                pattern: /Chrome\/(\d+)/,
                minVersion: 88,
                downloadUrl: 'https://www.google.com/chrome/',
                releaseDate: 'January 2021'
            },
            {
                name: 'Firefox', 
                pattern: /Firefox\/(\d+)/,
                minVersion: 85,
                downloadUrl: 'https://www.mozilla.org/firefox/',
                releaseDate: 'January 2021'
            },
            {
                name: 'Safari',
                pattern: /Version\/(\d+).*Safari/,
                minVersion: 14,
                downloadUrl: 'https://www.apple.com/safari/',
                releaseDate: 'September 2020'
            },
            {
                name: 'Edge',
                pattern: /Edg\/(\d+)/,
                minVersion: 88,
                downloadUrl: 'https://www.microsoft.com/edge',
                releaseDate: 'January 2021'
            }
        ];
        
        for (var i = 0; i < browsers.length; i++) {
            var browser = browsers[i];
            var match = userAgent.match(browser.pattern);
            if (match) {
                var version = parseInt(match[1], 10);
                return {
                    name: browser.name,
                    version: version,
                    minVersion: browser.minVersion,
                    isSupported: version >= browser.minVersion,
                    downloadUrl: browser.downloadUrl,
                    releaseDate: browser.releaseDate
                };
            }
        }
        
        return {
            name: 'Unknown',
            version: 0,
            minVersion: 999,
            isSupported: false,
            downloadUrl: 'https://www.google.com/chrome/',
            releaseDate: 'Unknown'
        };
    }
    
    // Test for ES2020+ features using try/catch
    function testModernFeatures() {
        var features = {
            optionalChaining: false,
            nullishCoalescing: false,
            bigInt: false,
            promiseAllSettled: false,
            stringMatchAll: false
        };
        
        // Test optional chaining
        try {
            eval('({})?.test?.property');
            features.optionalChaining = true;
        } catch (e) {
            // Expected in legacy browsers
        }
        
        // Test nullish coalescing
        try {
            eval('null ?? "default"');
            features.nullishCoalescing = true;
        } catch (e) {
            // Expected in legacy browsers
        }
        
        // Test BigInt
        try {
            eval('BigInt(123)');
            features.bigInt = true;
        } catch (e) {
            // Expected in legacy browsers
        }
        
        // Test Promise.allSettled
        try {
            features.promiseAllSettled = typeof Promise.allSettled === 'function';
        } catch (e) {
            // Expected in legacy browsers
        }
        
        // Test String.matchAll
        try {
            features.stringMatchAll = typeof 'test'.matchAll === 'function';
        } catch (e) {
            // Expected in legacy browsers
        }
        
        return features;
    }
    
    // Show enhanced browser upgrade warning
    function showEnhancedBrowserWarning(browserInfo, features) {
        var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        var mobileGuidance = isMobile ? 
            '<div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">' +
            '<strong>📱 Mobile Device Detected</strong><br>' +
            'Update your browser through your device\'s app store:<br>' +
            '<strong>iOS:</strong> Update Safari through Settings → General → Software Update<br>' +
            '<strong>Android:</strong> Update Chrome through Google Play Store' +
            '</div>' : '';
        
        var missingFeatures = [];
        if (!features.optionalChaining) missingFeatures.push('Optional Chaining (obj?.prop)');
        if (!features.nullishCoalescing) missingFeatures.push('Nullish Coalescing (null ?? default)');
        if (!features.bigInt) missingFeatures.push('BigInt support');
        if (!features.promiseAllSettled) missingFeatures.push('Promise.allSettled');
        if (!features.stringMatchAll) missingFeatures.push('String.matchAll');
        
        var warningHtml = 
            '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 10000; padding: 1rem; overflow-y: auto;">' +
            '<div style="max-width: 600px; margin: 2rem auto; background: white; padding: 2rem; border-radius: 12px; text-align: center;">' +
            '<h2 style="color: #dc3545; margin: 0 0 1rem 0;">🚫 Modern Browser Required</h2>' +
            '<p><strong>Your browser is not supported.</strong></p>' +
            '<p>Detected: ' + browserInfo.name + ' ' + browserInfo.version + (isMobile ? ' (Mobile)' : '') + '</p>' +
            '<p>Required: ' + browserInfo.name + ' ' + browserInfo.minVersion + '+ (Released ' + browserInfo.releaseDate + ')</p>' +
            '<div style="text-align: left; margin: 1rem 0;">' +
            '<h3>Missing Features:</h3>' +
            '<ul>' + missingFeatures.map(function(feature) { return '<li>' + feature + '</li>'; }).join('') + '</ul>' +
            '</div>' +
            '<h3>Why These Requirements?</h3>' +
            '<p style="text-align: left;">This WebRTC application requires modern JavaScript features for:</p>' +
            '<ul style="text-align: left;">' +
            '<li>🔒 Enhanced security for peer-to-peer communication</li>' +
            '<li>⚡ Better performance and reliability</li>' +
            '<li>🛡️ Modern WebRTC APIs with HTTPS support</li>' +
            '<li>📱 Optimal mobile and desktop experience</li>' +
            '</ul>' +
            mobileGuidance +
            '<div style="margin: 2rem 0;">' +
            '<a href="' + browserInfo.downloadUrl + '" style="display: inline-block; background: #007bff; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; margin: 0.5rem;">🌐 Download ' + browserInfo.name + '</a>' +
            '</div>' +
            '<p style="font-size: 0.875rem; color: #666; margin-top: 2rem;">Modern browsers provide better security, performance, and support for the latest web standards required for peer-to-peer communication.</p>' +
            '</div>' +
            '</div>';
        
        document.body.insertAdjacentHTML('beforeend', warningHtml);
    }
    
    // Main compatibility check
    function checkCompatibility() {
        var browserInfo = getBrowserInfo();
        var features = testModernFeatures();
        
        // Check if browser is supported
        if (!browserInfo.isSupported) {
            console.warn('Legacy browser detected:', browserInfo.name, browserInfo.version);
            showEnhancedBrowserWarning(browserInfo, features);
            return false;
        }
        
        // Check if required features are available
        var requiredFeatures = ['optionalChaining', 'nullishCoalescing', 'bigInt'];
        var missingFeatures = requiredFeatures.filter(function(feature) {
            return !features[feature];
        });
        
        if (missingFeatures.length > 0) {
            console.warn('Missing required features:', missingFeatures);
            showEnhancedBrowserWarning(browserInfo, features);
            return false;
        }
        
        console.log('✅ Browser compatibility check passed:', browserInfo.name, browserInfo.version);
        return true;
    }
    
    // Run compatibility check immediately
    if (!checkCompatibility()) {
        // Block further script execution for legacy browsers
        throw new Error('Legacy browser blocked - modern browser required');
    }
    
    // Export for testing
    window.syntaxCompatibilityDetector = {
        getBrowserInfo: getBrowserInfo,
        testModernFeatures: testModernFeatures,
        checkCompatibility: checkCompatibility
    };
    
})();