```
 ██████╗██████╗ ██████╗ ███████╗
██╔════╝██╔══██╗╚════██╗██╔════╝
██║     ██████╔╝ █████╔╝█████╗  
██║     ██╔══██╗██╔═══╝ ██╔══╝  
╚██████╗██████╔╝███████╗██║     
 ╚═════╝╚═════╝ ╚══════╝╚═╝     
```

# Clipboard to File (cb2f)

Simple CLI utility to save clipboard content (text/images) to files with intuitive syntax.

✅ **Tested on macOS Ventura, Monterey, Big Sur**

## Quick Start

```bash
# Install globally
npm install -g clipboard-2-file

# Save clipboard as specific filename
cb2f screenshot.png
cb2f notes.txt
cb2f config.json

# Take a screenshot (Cmd+Shift+Ctrl+4 on macOS), then:
cb2f bug-report.png
```

## Installation

### Option 1: npm (Recommended)

```bash
npm install -g clipboard-2-file
```

### Option 2: Development Setup

```bash
git clone git@github.com:obbaeiei/clipboard-2-file.git
cd clipboard-2-file
npm install
npm link
```

## Usage

### Simple Syntax (New!)

```bash
# Most common usage - specify filename with extension
cb2f filename.ext

# Examples:
cb2f screenshot.png    # Save clipboard image as screenshot.png
cb2f notes.txt         # Save clipboard text as notes.txt
cb2f bug-report.jpg    # Save clipboard image as bug-report.jpg
cb2f config.json       # Save clipboard as config.json
```

### Legacy Syntax (Still Supported)

```bash
cb2f <format> [output-path] [options]

# Examples:
cb2f png                        # Auto-generated timestamp filename
cb2f txt ~/Documents           # Save to specific directory
cb2f png . --name my-image     # Custom name with extension added
```

## Perfect for Screenshots

On macOS, use `Cmd+Shift+Ctrl+4` to copy screenshot to clipboard, then:

```bash
cb2f screenshot.png
cb2f bug-report.jpg
cb2f design-mockup.png
```

## Common Use Cases

```bash
# Screenshots and images
cb2f screenshot.png
cb2f bug-report.jpg
cb2f diagram.png
cb2f meme.gif

# Code and text
cb2f notes.txt
cb2f config.json
cb2f snippet.js
cb2f data.csv

# Quick saves with timestamps (legacy)
cb2f png                    # → clipboard-2024-12-05T14-30-45-123Z.png
cb2f txt                    # → clipboard-2024-12-05T14-30-45-456Z.txt
```

## Supported Formats

- **Text:** txt, md, json, js, ts, html, css, xml
- **Images:** png, jpg, jpeg, gif, webp, bmp

## Features

- ✅ **Intuitive syntax**: Just specify `filename.ext`
- ✅ **Auto-format detection**: Reads extension to determine format
- ✅ **Screenshot ready**: Perfect for `Cmd+Shift+Ctrl+4` screenshots
- ✅ **Cross-platform clipboard**: Works with text and images
- ✅ **Auto-generated names**: Fallback to timestamped filenames
- ✅ **Error handling**: Clear messages for troubleshooting

## Requirements

- **Node.js**: 14.0.0 or higher
- **OS**: macOS (uses native AppleScript for reliable image clipboard access)
- **Permissions**: Grant Terminal clipboard access when prompted

## Publishing to npm

```bash
# Update version and publish
npm version patch
npm publish
```

## Permissions Setup

### Required Permission for Images
When you first run `cb2f` with an image, you'll see this popup:

> "Terminal" wants access to control "System Events". Allowing control will provide access to documents and data in "System Events", and to perform actions within that app.

**Click "OK"** to allow this. This enables AppleScript to read clipboard images.

### Where to manage permissions:
- **System Settings** → **Privacy & Security** → **Automation** → **Terminal** → ✅ **System Events**
- **System Preferences** → **Security & Privacy** → **Privacy** → **Automation** → **Terminal** → ✅ **System Events**

### Quick access:
```bash
open "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation"
```

## Troubleshooting

### Clipboard Access Issues
- Grant **Automation** permission (see above) for image clipboard access
- Text clipboard works without special permissions
- Try copying content again before running command

### Image Not Saving
- Use `Cmd+Shift+Ctrl+4` (not `Cmd+Shift+4`) to copy screenshot to clipboard
- Verify image is in clipboard with: `osascript -e "clipboard info"`
- Check Automation permission is enabled for Terminal → System Events

### Permission Denied Errors
- Enable Automation permission: **Terminal** → **System Events** ✅
- Restart Terminal after granting permission