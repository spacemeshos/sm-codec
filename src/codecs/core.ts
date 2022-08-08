import { CodecType, str, Struct } from 'scale-ts';
import { Hash32 } from './common';
import { Compact32, Compact8 } from './compact';

export const ZERO = Compact8.enc(0n);
export const ONE = Compact8.enc(1n);

export const Address = str;
export type Address = CodecType<typeof Address>;

export const PublicKey = Hash32;
export type PublicKey = CodecType<typeof PublicKey>;

export const Nonce = Struct({
  Counter: Compact32,
  Bitfield: Compact8,
});
export type Nonce = CodecType<typeof Nonce>;

export const GasPrice = Compact32;
export type GasPrice = CodecType<typeof GasPrice>;
