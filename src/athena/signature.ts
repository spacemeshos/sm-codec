import { Bytes, createCodec } from 'scale-ts';
import { toBytes } from '../utils/hex';

const SingleSig = Bytes(64);

const Signature = createCodec<Uint8Array | null>(
  (value) => {
    if (value) {
      return SingleSig.enc(value);
    }
    return new Uint8Array([]);
  },
  (bytes) => {
    let u8a: Uint8Array;
    if (typeof bytes === 'string') {
      u8a = toBytes(bytes);
    } else if (bytes instanceof ArrayBuffer) {
      u8a = new Uint8Array(bytes);
    } else {
      u8a = Uint8Array.from(bytes);
    }
    return u8a.length === 0 ? null : SingleSig.dec(u8a.slice(-64));
  }
);

export default Signature;
