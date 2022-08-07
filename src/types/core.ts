import { Struct } from 'scale-ts';
import { Hash20, Hash32 } from './common';
import { Compact32, Compact8 } from './compact';

export const Address = Hash20;
export const PublicKey = Hash32;

export const Nonce = Struct({
  Counter: Compact32,
  Bitfield: Compact8,
});

export const GasPrice = Compact32;
