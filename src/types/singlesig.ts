import { Struct } from 'scale-ts';
import { Compact32 } from './compact';
import { Address, Nonce, PublicKey, GasPrice } from './core';

export const SpawnArguments = Struct({
  PublicKey,
});

export const SpawnPayload = Struct({
  Arguments: SpawnArguments,
  GasPrice,
});

export const SpendArguments = Struct({
  Destination: Address,
  Amount: Compact32,
});

export const SpendPayload = Struct({
  Arguments: SpendArguments,
  Nonce,
  GasPrice,
});
