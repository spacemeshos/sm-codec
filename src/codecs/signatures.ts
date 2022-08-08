import { Bytes, CodecType, Struct, u8, Vector } from 'scale-ts';

export const SingleSig = Bytes(64);
export type SingleSig = Uint8Array;

export const MultiSig = (n: number) =>
  Struct({
    SigCfg: u8,
    Signatures: Vector(SingleSig, n),
  });
export type MultiSig = CodecType<ReturnType<typeof MultiSig>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMultiSigData = (x: any): x is MultiSig =>
  x.SigCfg && x.Signatures;
