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