import { Bytes, CodecType } from 'scale-ts';
import { Compact32, Compact64 } from './compact';
//
export const ADDRESS_BYTES_LENGTH = 24;

export const Address = Bytes(ADDRESS_BYTES_LENGTH);
export type Address = CodecType<typeof Address>;

export const PublicKey = Bytes(32);
export type PublicKey = CodecType<typeof PublicKey>;

export const Nonce = Compact64;
export type Nonce = CodecType<typeof Nonce>;

export const GasPrice = Compact32;
export type GasPrice = CodecType<typeof GasPrice>;
