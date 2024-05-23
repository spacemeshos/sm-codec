import { Codec, Struct } from 'scale-ts';
import { GasPrice, Nonce } from '../codecs/core';

export const TxPayload = <T>(Arguments: Codec<T>) =>
  Struct({
    Nonce,
    GasPrice,
    Arguments,
  });
