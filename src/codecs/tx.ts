import { Codec } from 'scale-ts';
import { TransactionData, Payload } from '../transaction';
import { Compact8 } from './compact';
import { Address, Context, Struct } from './core';

const TxCodec = <T extends Payload>(
  txCodec: Codec<T> | ((ctx: Context) => Codec<T>)
): ((ctx: Context) => Codec<TransactionData<T>>) =>
  Struct({
    TransactionType: Compact8,
    Principal: Address,
    MethodSelector: Compact8,
    Payload: txCodec,
  });

export default TxCodec;
