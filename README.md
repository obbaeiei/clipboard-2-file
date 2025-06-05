# Clipboard to File (cb2f)

A simple CLI utility to convert clipboard content to files.

## Installation

```bash
npm install
npm link  # or npm install -g .
```

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