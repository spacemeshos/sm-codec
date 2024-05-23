import { Bytes, CodecType, createCodec, Struct, u8 } from 'scale-ts';
import { toBytes } from '../utils/hex';

export const SingleSig = Bytes(64);
export type SingleSig = Uint8Array;

export const Signatures = createCodec(
  (input: Uint8Array[]) => {
    const buffer = new Uint8Array(input.length * 64);
    input.forEach((sig, i) => {
      buffer.set(sig, i * 64);
    });
    return buffer;
  },
  (input: Uint8Array | string | ArrayBuffer) => {
    const signatures: Uint8Array[] = [];
    const inputArray =
      input instanceof Uint8Array
        ? input
        : typeof input === 'string'
        ? toBytes(input)
        : new Uint8Array(input);
    for (let i = 0; i < inputArray.length; i += 64) {
      signatures.push(inputArray.slice(i, i + 64));
    }
    return signatures;
  }
);

export const MultiSig = Struct({
  SigCfg: u8,
  Signatures,
});
export type MultiSig = CodecType<typeof MultiSig>;
