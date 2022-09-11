import { Bytes, CodecType, Struct } from 'scale-ts';
import { Compact32, Compact8 } from './compact';
//
export const ADDRESS_BYTES_LENGTH = 24;

export const Address = Bytes(ADDRESS_BYTES_LENGTH);
export type Address = CodecType<typeof Address>;

export const PublicKey = Bytes(32);
export type PublicKey = CodecType<typeof PublicKey>;

export const Nonce = Struct({
  Counter: Compact32,
  Bitfield: Compact8,
});
export type Nonce = CodecType<typeof Nonce>;

export const GasPrice = Compact32;
export type GasPrice = CodecType<typeof GasPrice>;
