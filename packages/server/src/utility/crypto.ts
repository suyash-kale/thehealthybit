import {
  scryptSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from 'crypto';

import { ENV } from './env';

const algorithm = 'aes-256-ctr';
const KEY = scryptSync(ENV.SECRET, 'salt', 32);
const iv = randomBytes(16);

// encrypting plan text.
export const encrypt = (text: string): string => {
  const cipher = createCipheriv(algorithm, KEY, iv);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
};

// decrypting encrypted text.
export const decrypt = (encrypted: string): string => {
  const decipher = createDecipheriv(algorithm, KEY, iv);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
};

// decrypting base64 to string.
export const base64ToString = (data: string) =>
  Buffer.from(data, 'base64').toString();
