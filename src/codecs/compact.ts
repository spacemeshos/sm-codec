import { compact, createCodec, enhanceDecoder, enhanceEncoder } from 'scale-ts';
import {
  U8,
  U16,
  U32,
  U64,
  AnyUAssertion,
  Uint8,
  Uint16,
  Uint32,
  Uint64,
} from '../utils/uints';

const CompactU = (u: AnyUAssertion) =>
  createCodec(enhanceEncoder(compact.enc, u), enhanceDecoder(compact.dec, u));
export const Compact8 = CompactU(U8);
export type Compact8 = Uint8;
export const Compact16 = CompactU(U16);
export type Compact16 = Uint16;

export const Compact32 = CompactU(U32);
export type Compact32 = Uint32;
export const Compact64 = CompactU(U64);
export type Compact64 = Uint64;

export type AnyCompactCodec =
  | typeof Compact8
  | typeof Compact16
  | typeof Compact32
  | typeof Compact64;
