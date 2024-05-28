import { Bytes, CodecType, createCodec, Struct } from 'scale-ts';
import { toBytes } from '../utils/hex';
import { Compact8 } from './compact';

export const SingleSig = Bytes(64);
export type SingleSig = Uint8Array;

export const MultiSigPart = Struct({
  Ref: Compact8,
  Sig: SingleSig,
});

export type MultiSigPart = CodecType<typeof MultiSigPart>;

export const Signatures = createCodec(
  (input: MultiSigPart[]) =>
    Uint8Array.from(
      input.reduce(
        (acc, part) => [...acc, ...MultiSigPart.enc(part)],
        <number[]>[]
      )
    ),
  (input: Uint8Array | string | ArrayBuffer) => {
    const inputArray =
      input instanceof Uint8Array
        ? input
        : typeof input === 'string'
          ? toBytes(input)
          : new Uint8Array(input);

    const parts: MultiSigPart[] = [];

    let rest = inputArray;
    while (rest.length > 0) {
      const part = MultiSigPart.dec(rest);
      const len = MultiSigPart.enc(part).length;
      rest = rest.slice(len);
      parts.push(part);
    }
    return parts;
  }
);

export const MultiSig = Signatures;
export type MultiSig = CodecType<typeof MultiSig>;
