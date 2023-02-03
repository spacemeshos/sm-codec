import crypto from 'crypto';

const hash = (input: crypto.BinaryLike) =>
  Uint8Array.from(crypto.createHash('sha256').update(input).digest());

export default hash;
