#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const clipboardy = require('clipboardy');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const supportedFormats = {
  text: ['txt', 'md', 'json', 'js', 'ts', 'html', 'css', 'xml'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
};

function generateFileName(extension, outputPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `clipboard-${timestamp}.${extension}`;
  return path.resolve(outputPath, fileName);
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

async function saveImageToFile(base64Data, filePath) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.promises.writeFile(filePath, buffer);
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
    .usage('Usage: cb2f <format> [output-path]')
    .command('$0 <format> [outputPath]', 'Convert clipboard content to file', (yargs) => {
      yargs
        .positional('format', {
          describe: 'Output file format (txt, png, jpg, etc.)',
          type: 'string'
        })
        .positional('outputPath', {
          describe: 'Output directory path',
          type: 'string',
          default: '.'
        });
    })
    .example('cb2f png .', 'Save clipboard image as PNG in current directory')
    .example('cb2f txt ~/Documents', 'Save clipboard text as TXT in Documents folder')
    .example('cb2f json', 'Save clipboard text as JSON in current directory')
    .help()
    .argv;

  const format = argv.format.toLowerCase();
  const outputPath = path.resolve(argv.outputPath);

  if (!fs.existsSync(outputPath)) {
    console.error(`Error: Output path "${outputPath}" does not exist.`);
    process.exit(1);
  }

  if (!isImageFormat(format) && !isTextFormat(format)) {
    console.error(`Error: Unsupported format "${format}". Supported formats: ${[...supportedFormats.text, ...supportedFormats.image].join(', ')}`);
    process.exit(1);
  }

  try {
    let clipboardContent;
    
    if (isImageFormat(format)) {
      try {
        clipboardContent = await clipboardy.read({ type: 'png' });
        if (!clipboardContent || clipboardContent.length === 0) {
          console.error('Error: No image found in clipboard.');
          process.exit(1);
        }
      } catch (error) {
        console.error('Error: No image found in clipboard or clipboard access failed.');
        process.exit(1);
      }
    } else {
      clipboardContent = await clipboardy.read();
      if (!clipboardContent || clipboardContent.trim().length === 0) {
        console.error('Error: No text found in clipboard.');
        process.exit(1);
      }
    }

    const filePath = generateFileName(format, outputPath);

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