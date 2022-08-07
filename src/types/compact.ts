import { compact, createCodec, enhanceDecoder, enhanceEncoder } from 'scale-ts';
import { U8, U16, U32, U64, AnyUAssertion } from './uints';

const CompactU = (u: AnyUAssertion) =>
  createCodec(enhanceEncoder(compact.enc, u), enhanceDecoder(compact.dec, u));
export const Compact8 = CompactU(U8);
export const Compact16 = CompactU(U16);

export const Compact32 = CompactU(U32);
export const Compact64 = CompactU(U64);

export type AnyCompact =
  | typeof Compact8
  | typeof Compact16
  | typeof Compact32
  | typeof Compact64;
