import { Codec, Struct } from 'scale-ts';
import { Payload } from '../transaction';
import { Compact8 } from './compact';
import { Address } from './core';

export const TxHeader = Struct({
  TransactionType: Compact8,
  Principal: Address,
  MethodSelector: Compact8,
});

const TxCodec = <T extends Payload>(txCodec: Codec<T>) =>
  Struct({
    TransactionType: Compact8,
    Principal: Address,
    MethodSelector: Compact8,
    Payload: txCodec,
  });

export default TxCodec;
