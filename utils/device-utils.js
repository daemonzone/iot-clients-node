import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Returns a random word from a predefined list.
 */
export function randomWord() {
  const words = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet'];
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Returns a short MD5-like string (6 hex chars)
 */
export function shortId() {
  return crypto.randomBytes(3).toString('hex'); // 3 bytes → 6 hex chars
}

/**
 * Checks if device image exists and is a valid one
 */
function isValidImage(imagePath) {
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.error(`Image file not found: ${imagePath}`);
    return false;
  }

  // Check file extension
  const ext = path.extname(imagePath).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  return allowed.includes(ext)
}

/**
 * Supported image mime/types
 */
const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };

/**
 * Returns a base64 encoding of the device image
 */
export function deviceImage(imagePath) {
  if (!isValidImage(imagePath)) return;

  let imageBase64 = null;
  let mime = null;

  try {
    const ext = path.extname(imagePath).toLowerCase();

    mime = mimeTypes[ext];
    if (!mime) {
      console.error(`Unsupported image type: ${ext}`);
      return null;
    }

    const buffer = fs.readFileSync(imagePath);
    imageBase64 = buffer.toString('base64');
  } catch (err) {
    console.error('Error reading image file:', err);
  }

  return `data:${mime};base64,${imageBase64}`;
}
