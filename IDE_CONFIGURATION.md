# IDE Configuration for JavaScript Syntax Compatibility

This document provides comprehensive IDE configuration guidance for developing with modern JavaScript features (ES2020+) used in the WebRTC PeerJS Chat application.

## Overview

The application uses cutting-edge JavaScript features including:
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- BigInt support
- Private class fields (`#private`)
- Top-level await
- Modern Promise methods (`Promise.allSettled`)
- Advanced array methods (`flatMap`, `structuredClone`)

## IDE Configuration

### Visual Studio Code

#### Required Extensions

Install these extensions for optimal development experience:

```bash
# Essential extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json

# Optional but recommended
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-eslint
```

#### Settings Configuration

Create or update `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "javascript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.importModuleSpecifier": "relative",
  "javascript.preferences.importModuleSpecifier": "relative",
  "javascript.validate.enable": true,
  "typescript.validate.enable": true,
  "javascript.format.enable": true,
  "typescript.format.enable": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.html": "html"
  },
  "html.suggest.html5": true,
  "css.validate": true,
  "scss.validate": true,
  "less.validate": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.detectIndentation": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/.git": true,
    "**/.DS_Store": true
  }
}
```

#### Workspace Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:8000/chat.html",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": false,
      "userDataDir": false,
      "runtimeArgs": [
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor"
      ]
    },
    {
      "name": "Launch Firefox",
      "request": "launch",
      "type": "firefox",
      "url": "http://localhost:8000/chat.html",
      "webRoot": "${workspaceFolder}",
      "pathMappings": [
        {
          "url": "http://localhost:8000",
          "path": "${workspaceFolder}"
        }
      ]
    }
  ]
}
```

#### Tasks Configuration

Create `.vscode/tasks.json` for development tasks:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Server",
      "type": "shell",
      "command": "bun",
      "args": ["run", "dev"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Open in Browser",
      "type": "shell",
      "command": "open",
      "args": ["https://localhost:8443/chat.html"],
      "group": "test",
      "dependsOn": "Start Development Server",
      "presentation": {
        "echo": true,
        "reveal": "silent",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Validate Syntax",
      "type": "shell",
      "command": "node",
      "args": ["-c", "console.log('Syntax validation passed')"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### WebStorm/IntelliJ IDEA

#### JavaScript Language Version

1. Go to **File** → **Settings** (or **WebStorm** → **Preferences** on macOS)
2. Navigate to **Languages & Frameworks** → **JavaScript**
3. Set **JavaScript language version** to **ES2020** or **Latest**
4. Enable **Use strict mode**
5. Check **Prefer TypeScript service**

#### Code Style Configuration

1. Go to **Settings** → **Editor** → **Code Style** → **JavaScript**
2. Set **Tab size**: 4
3. Set **Indent**: 4
4. Enable **Use tab character**: false
5. Configure **Wrapping and Braces**:
   - **Keep when reformatting**: Line breaks, Line breaks in code, Comment at first column
   - **Binary expressions**: Wrap if long
   - **Assignment statement**: Wrap if long

#### File Templates

Create custom file templates for consistent structure:

1. Go to **Settings** → **Editor** → **File and Code Templates**
2. Create new template for HTML files:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${NAME}</title>
</head>
<body>
    <script>
        // Modern JavaScript (ES2020+) code here
        'use strict';
        
        // Your code here
    </script>
</body>
</html>
```

#### Live Templates

Create live templates for common ES2020+ patterns:

1. Go to **Settings** → **Editor** → **Live Templates**
2. Create new template group "ES2020"
3. Add templates:

**Optional Chaining** (abbreviation: `oc`):
```javascript
$OBJECT$?.$PROPERTY$?.$NESTED$
```

**Nullish Coalescing** (abbreviation: `nc`):
```javascript
$VALUE$ ?? $DEFAULT$
```

**Async Function** (abbreviation: `af`):
```javascript
const $NAME$ = async ($PARAMS$) => {
    try {
        $BODY$
    } catch (error) {
        console.error('Error in $NAME$:', error);
        throw error;
    }
};
```

### Sublime Text

#### Package Installation

Install Package Control and these packages:

```
- SublimeLinter
- SublimeLinter-jshint
- JavaScript Completions
- Emmet
- BracketHighlighter
- SideBarEnhancements
```

#### Settings Configuration

Create `Preferences.sublime-settings`:

```json
{
    "tab_size": 4,
    "translate_tabs_to_spaces": true,
    "detect_indentation": true,
    "trim_trailing_white_space_on_save": true,
    "ensure_newline_at_eof_on_save": true,
    "word_wrap": true,
    "rulers": [80, 120],
    "show_line_endings": true,
    "default_encoding": "UTF-8",
    "fallback_encoding": "UTF-8"
}
```

#### JavaScript Syntax Configuration

Create `JavaScript.sublime-settings`:

```json
{
    "extensions": ["js", "mjs"],
    "auto_complete_triggers": [
        {"selector": "source.js", "characters": "."},
        {"selector": "source.js", "characters": "?."},
        {"selector": "source.js", "characters": "??"}
    ]
}
```

### Atom (Legacy Support)

#### Package Installation

```bash
apm install language-javascript
apm install autocomplete-plus
apm install linter
apm install linter-jshint
apm install emmet
apm install file-icons
```

#### Configuration

Create `config.cson`:

```cson
"*":
  core:
    telemetryConsent: "no"
  editor:
    fontSize: 14
    tabLength: 4
    softTabs: true
    showIndentGuide: true
    showInvisibles: true
  "autocomplete-plus":
    enableAutoActivation: true
  linter:
    lintOnFly: true
```

## Browser Configuration for Development

### Chrome DevTools

#### Enable Experimental Features

1. Open Chrome DevTools (F12)
2. Go to **Settings** (gear icon)
3. Navigate to **Experiments**
4. Enable:
   - **JavaScript Profiler**
   - **WebAssembly Debugging**
   - **CSS Overview**
   - **Full accessibility tree view**

#### Console Settings

1. In DevTools Console, click **Settings** (gear icon)
2. Enable:
   - **Log XMLHttpRequests**
   - **Show timestamps**
   - **Autocomplete from history**
   - **Group similar messages in console**

### Firefox Developer Tools

#### Enable Advanced Features

1. Open Developer Tools (F12)
2. Go to **Settings** (gear icon in top-right)
3. Enable:
   - **Enable browser chrome and add-on debugging toolboxes**
   - **Enable remote debugging**
   - **Show browser styles**

### Safari Web Inspector

#### Enable Development Menu

1. Open **Safari** → **Preferences**
2. Go to **Advanced** tab
3. Check **Show Develop menu in menu bar**
4. In **Develop** menu, enable **Show Web Inspector**

## Common Syntax Error Solutions

### Error: "Unexpected token '?'"

**Cause**: IDE or browser doesn't recognize optional chaining syntax

**Solutions**:

1. **Update Browser**: Use Chrome 80+, Firefox 72+, or Safari 13.1+
2. **Update IDE**: Configure for ES2020+ support
3. **Check Settings**: Ensure JavaScript language version is set to ES2020+

**VS Code Fix**:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "javascript.validate.enable": true
}
```

**WebStorm Fix**:
- **Settings** → **Languages & Frameworks** → **JavaScript** → Set to **ES2020**

### Error: "',' expected"

**Cause**: Parser doesn't understand nullish coalescing operator

**Solutions**:

1. **Parser Configuration**: Update JavaScript language level
2. **Babel Configuration**: Add appropriate presets for development
3. **Alternative Syntax**: Use compatibility functions during development

**Development Workaround**:
```javascript
// Instead of: const value = config.timeout ?? 5000;
// Use: const value = config.timeout !== null && config.timeout !== undefined ? config.timeout : 5000;
```

### Error: "BigInt is not defined"

**Cause**: Environment doesn't support BigInt

**Solutions**:

1. **Update Environment**: Use Node.js 10.4+ or modern browser
2. **Polyfill**: Add BigInt polyfill for development
3. **Feature Detection**: Check support before using

**Feature Detection**:
```javascript
if (typeof BigInt !== 'undefined') {
    const bigNumber = BigInt(123);
} else {
    console.warn('BigInt not supported in this environment');
}
```

### Error: "Private field '#property' must be declared in an enclosing class"

**Cause**: Private class fields not supported

**Solutions**:

1. **Update Parser**: Ensure ES2022+ support
2. **Alternative Pattern**: Use WeakMap for privacy
3. **Conventional Privacy**: Use underscore prefix

**Alternative Pattern**:
```javascript
// Instead of private fields
const privateData = new WeakMap();

class MyClass {
    constructor(value) {
        privateData.set(this, { value });
    }
    
    getValue() {
        return privateData.get(this).value;
    }
}
```

## Development Workflow

### Recommended Development Setup

1. **Use Modern Browser**: Chrome 88+, Firefox 85+, or Safari 14+
2. **Configure IDE**: Set JavaScript language level to ES2020+
3. **Enable Strict Mode**: Add `'use strict';` to scripts
4. **Use HTTPS**: Required for WebRTC in production
5. **Test Compatibility**: Verify modern browser detection works

### Testing Modern Features

Create a test file to verify your environment supports required features:

```javascript
// test-modern-features.js
'use strict';

const testModernFeatures = () => {
    const results = [];
    
    // Test optional chaining
    try {
        const test = {}?.test?.property;
        results.push({ feature: 'Optional Chaining', supported: true });
    } catch (e) {
        results.push({ feature: 'Optional Chaining', supported: false, error: e.message });
    }
    
    // Test nullish coalescing
    try {
        const test = null ?? 'default';
        results.push({ feature: 'Nullish Coalescing', supported: true });
    } catch (e) {
        results.push({ feature: 'Nullish Coalescing', supported: false, error: e.message });
    }
    
    // Test BigInt
    try {
        const test = BigInt(123);
        results.push({ feature: 'BigInt', supported: true });
    } catch (e) {
        results.push({ feature: 'BigInt', supported: false, error: e.message });
    }
    
    // Test Promise.allSettled
    try {
        const test = Promise.allSettled([Promise.resolve(1)]);
        results.push({ feature: 'Promise.allSettled', supported: true });
    } catch (e) {
        results.push({ feature: 'Promise.allSettled', supported: false, error: e.message });
    }
    
    console.table(results);
    return results;
};

// Run test
testModernFeatures();
```

### Debugging Modern JavaScript

#### Chrome DevTools

1. **Sources Panel**: Set breakpoints in modern JavaScript code
2. **Console**: Test ES2020+ features interactively
3. **Network Panel**: Monitor WebRTC connections
4. **Application Panel**: Inspect storage and service workers

#### Firefox Developer Tools

1. **Debugger**: Step through modern JavaScript execution
2. **Console**: Evaluate modern syntax expressions
3. **Network Monitor**: Track peer connections
4. **Storage Inspector**: View application data

#### Safari Web Inspector

1. **Sources**: Debug modern JavaScript features
2. **Console**: Test cutting-edge browser APIs
3. **Network**: Monitor WebRTC traffic
4. **Storage**: Inspect local data

## Troubleshooting

### Common Issues and Solutions

#### Issue: IDE shows syntax errors for valid ES2020+ code

**Solution**: Update IDE JavaScript language version to ES2020 or later

#### Issue: Browser console shows "Unexpected token" errors

**Solution**: Ensure you're using a modern browser (Chrome 80+, Firefox 72+, Safari 13.1+)

#### Issue: WebRTC features not working in development

**Solution**: Use HTTPS or localhost for development, HTTP blocks WebRTC

#### Issue: Optional chaining not working in Node.js

**Solution**: Use Node.js 14+ or enable experimental features with `--harmony`

### Getting Help

1. **Check Browser Compatibility**: Use [caniuse.com](https://caniuse.com) for feature support
2. **MDN Documentation**: Reference [developer.mozilla.org](https://developer.mozilla.org) for syntax
3. **IDE Documentation**: Consult your IDE's JavaScript configuration guide
4. **Community Support**: Ask questions on Stack Overflow with specific error messages

## Conclusion

Proper IDE configuration is essential for developing with modern JavaScript features. This guide provides comprehensive setup instructions for popular development environments and solutions to common syntax compatibility issues.

Remember to:
- Keep your development tools updated
- Use modern browsers for testing
- Configure your IDE for ES2020+ support
- Test compatibility across different environments
- Use feature detection for robust code

For additional help, refer to the application's environment detection utilities that automatically identify compatibility issues and provide guidance.