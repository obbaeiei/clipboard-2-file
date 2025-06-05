# Clipboard to File (cb2f)

A simple CLI utility to convert clipboard content to files.

## Installation

### From GitHub (Development)

```bash
# Clone the repository
git clone git@github.com:obbaeiei/clipboard-2-file.git
cd clipboard-2-file

# Install dependencies
npm install

# Link globally to make 'cb2f' command available anywhere
npm link
```

### From npm (when published)

```bash
npm install -g clipboard-2-file
```

### What does `npm link` do?

`npm link` creates a global symlink to your local package:
1. Creates symlink: `/usr/local/lib/node_modules/clipboard-2-file` → `your-local-project`
2. Makes CLI available globally: `/usr/local/bin/cb2f` → executable script
3. Any code changes are immediately reflected (great for development)

To unlink: `npm unlink -g clipboard-2-file`

## Usage

```bash
cb2f <format> [output-path]
```

### Examples

```bash
# Save clipboard image as PNG in current directory
cb2f png .

# Save clipboard text as TXT in Documents folder  
cb2f txt ~/Documents

# Save clipboard content as JSON in current directory
cb2f json

# Save clipboard image as JPG
cb2f jpg /path/to/output
```

### Supported Formats

**Text formats:** txt, md, json, js, ts, html, css, xml
**Image formats:** png, jpg, jpeg, gif, webp, bmp

## Features

- Auto-generates timestamped filenames
- Cross-platform clipboard access
- Support for both text and image clipboard content
- Error handling with helpful messages
- Flexible output path specification

## Requirements

- Node.js 12+
- npm or yarn