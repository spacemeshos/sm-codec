import crypto from 'crypto';

export const sha256 = (input: crypto.BinaryLike) =>
  Uint8Array.from(crypto.createHash('sha256').update(input).digest());
