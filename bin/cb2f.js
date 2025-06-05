#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const execAsync = promisify(exec);

const supportedFormats = {
  text: ['txt', 'md', 'json', 'js', 'ts', 'html', 'css', 'xml'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
};

function generateFileName(extension, outputPath, customName = null) {
  if (customName) {
    // If customName already has an extension, use it as-is
    if (path.extname(customName)) {
      return path.resolve(outputPath, customName);
    }
    // Otherwise, add the extension
    const fileName = `${customName}.${extension}`;
    return path.resolve(outputPath, fileName);
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `clipboard-${timestamp}.${extension}`;
  return path.resolve(outputPath, fileName);
}

function parseFileArgument(arg) {
  const parsed = path.parse(arg);
  if (parsed.ext) {
    // Argument has extension (e.g., "test.png")
    return {
      filename: arg,
      format: parsed.ext.slice(1).toLowerCase(), // Remove the dot
      outputPath: '.'
    };
  } else {
    // Legacy format (format only, e.g., "png")
    return {
      filename: null,
      format: arg.toLowerCase(),
      outputPath: '.'
    };
  }
}

async function saveTextToFile(content, filePath) {
  try {
    await fs.promises.writeFile(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving text file: ${error.message}`);
    return false;
  }
}

async function readImageFromClipboard() {
  try {
    // Use osascript to check if clipboard contains image data
    const { stdout: clipboardInfo } = await execAsync('osascript -e "clipboard info"');
    if (!clipboardInfo.includes('PNGf') && !clipboardInfo.includes('JPEG') && !clipboardInfo.includes('TIFF')) {
      return null;
    }

    // Create a temporary file to save clipboard image
    const tempFile = path.join(require('os').tmpdir(), `clipboard-temp-${Date.now()}.png`);
    
    // Use AppleScript to save clipboard image to file
    const script = `
      tell application "System Events"
        set imageData to the clipboard as «class PNGf»
        set fileRef to open for access POSIX file "${tempFile}" with write permission
        write imageData to fileRef
        close access fileRef
      end tell
    `;
    
    await execAsync(`osascript -e '${script.replace(/'/g, "\\'")}'`);
    
    // Check if file was created and has content
    const stats = await fs.promises.stat(tempFile);
    if (stats.size === 0) {
      await fs.promises.unlink(tempFile);
      return null;
    }
    
    // Read the file as buffer
    const buffer = await fs.promises.readFile(tempFile);
    
    // Clean up temp file
    await fs.promises.unlink(tempFile);
    
    return buffer;
  } catch (error) {
    throw new Error(`Failed to read image from clipboard: ${error.message}`);
  }
}

async function saveImageToFile(imageData, filePath) {
  try {
    await fs.promises.writeFile(filePath, imageData);
    return true;
  } catch (error) {
    console.error(`Error saving image file: ${error.message}`);
    return false;
  }
}

function isImageFormat(format) {
  return supportedFormats.image.includes(format.toLowerCase());
}

function isTextFormat(format) {
  return supportedFormats.text.includes(format.toLowerCase());
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: cb2f <filename.ext|format> [output-path]')
    .command('$0 <input> [outputPath]', 'Convert clipboard content to file', (yargs) => {
      yargs
        .positional('input', {
          describe: 'Filename with extension (e.g., test.png) or format (e.g., png)',
          type: 'string'
        })
        .positional('outputPath', {
          describe: 'Output directory path (optional when using filename.ext)',
          type: 'string',
          default: '.'
        })
        .option('name', {
          alias: 'n',
          describe: 'Custom filename (without extension)',
          type: 'string'
        });
    })
    .example('cb2f screenshot.png', 'Save clipboard image as screenshot.png')
    .example('cb2f notes.txt', 'Save clipboard text as notes.txt')
    .example('cb2f bug-report.jpg', 'Save clipboard image as bug-report.jpg')
    .example('cb2f config.json', 'Save clipboard text as config.json')
    .example('cb2f png', 'Save clipboard image with auto-generated name')
    .example('cb2f txt ~/Documents', 'Save clipboard text to Documents folder')
    .help()
    .argv;

  const parsed = parseFileArgument(argv.input);
  const format = parsed.format;
  let outputPath = path.resolve(argv.outputPath);
  let customName = argv.name || parsed.filename;

  if (!fs.existsSync(outputPath)) {
    console.error(`Error: Output path "${outputPath}" does not exist.`);
    process.exit(1);
  }

  if (!isImageFormat(format) && !isTextFormat(format)) {
    console.error(`Error: Unsupported format "${format}". Supported formats: ${[...supportedFormats.text, ...supportedFormats.image].join(', ')}`);
    process.exit(1);
  }

  try {
    const clipboardy = await import('clipboardy');
    let clipboardContent;
    
    if (isImageFormat(format)) {
      try {
        clipboardContent = await readImageFromClipboard();
        if (!clipboardContent || clipboardContent.length === 0) {
          console.error('Error: No image found in clipboard.');
          console.error('Make sure you have copied an image and granted clipboard permissions to Terminal.');
          process.exit(1);
        }
      } catch (error) {
        console.error('Error: Clipboard access failed:', error.message);
        console.error('On macOS: Go to System Preferences > Security & Privacy > Privacy > Input Monitoring and add Terminal/iTerm.');
        process.exit(1);
      }
    } else {
      try {
        clipboardContent = await clipboardy.default.read();
        if (!clipboardContent || clipboardContent.trim().length === 0) {
          console.error('Error: No text found in clipboard.');
          console.error('Make sure you have copied some text and granted clipboard permissions to Terminal.');
          process.exit(1);
        }
      } catch (error) {
        console.error('Error: Clipboard access failed:', error.message);
        console.error('On macOS: Go to System Preferences > Security & Privacy > Privacy > Input Monitoring and add Terminal/iTerm.');
        process.exit(1);
      }
    }

    const filePath = generateFileName(format, outputPath, customName);

    let success;
    if (isImageFormat(format)) {
      success = await saveImageToFile(clipboardContent, filePath);
    } else {
      success = await saveTextToFile(clipboardContent, filePath);
    }

    if (success) {
      console.log(`✓ Clipboard content saved to: ${filePath}`);
    } else {
      console.error('Failed to save clipboard content.');
      process.exit(1);
    }

  } catch (error) {
    console.error(`Error accessing clipboard: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main };