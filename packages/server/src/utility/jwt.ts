import jsonwebtoken from 'jsonwebtoken';

import { ENV } from './env';

const SECRET = ENV.SECRET;

// signing jwt.
export const sign = <T extends Record<string, unknown>>(o: T): string =>
  jsonwebtoken.sign(o, SECRET);

// verifying jwt.
export const verify = <T extends Record<string, unknown>>(
  token: string,
): Promise<T> =>
  new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as T);
      }
    });
  });
