import { Address } from './codecs/core';
import { Uint8 } from './utils/uints';
import { SingleSig, MultiSig } from './codecs/signatures';
import { Codec, Struct } from 'scale-ts';
import TxCodec from './codecs/tx';
import { concatBytes } from './utils/bytes';
import hash from './utils/hash';
import { padAddress } from './utils/padBytes';

export interface Payload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string | number]: any;
}
export interface SpawnPayload extends Payload {
  TemplateAddress: Address;
}

export interface TransactionData<T extends Payload> {
  TransactionType: Uint8;
  Principal: Address;
  MethodSelector: Uint8;
  Payload: T;
  Signature?: SingleSig;
  Signatures?: MultiSig;
}

class Transaction<SP extends Payload, T extends Payload, S> {
  private type = 0n;
  private address: Address;
  private mehtodSelector: bigint;
  public spawnArgsCodec: Codec<SP>;
  public payloadCodec: Codec<T>;
  private codec: Codec<TransactionData<T>>;
  private sigCodec: Codec<S>;

  constructor({
    address,
    methodSelector,
    spawnArgsCodec,
    payloadCodec,
    sigCodec,
  }: {
    address: Address;
    methodSelector: number;
    spawnArgsCodec: Codec<SP>;
    payloadCodec: Codec<T>;
    sigCodec: Codec<S>;
  }) {
    this.address = address;
    this.mehtodSelector = BigInt(methodSelector);
    this.payloadCodec = payloadCodec;
    this.spawnArgsCodec = spawnArgsCodec;
    this.sigCodec = sigCodec;
    this.codec = TxCodec(this.payloadCodec);
  }

  encode(principal: Address, payload: T) {
    return this.codec.enc({
      TransactionType: 0n,
      Principal: principal,
      MethodSelector: this.mehtodSelector,
      Payload: payload,
    });
  }
  principal(spawnArgs: SP) {
    const bytes = concatBytes(
      Address.enc(this.address),
      this.spawnArgsCodec.enc(spawnArgs)
    );
    return padAddress(hash(bytes).slice(12));
  }
  decode(bytes: Uint8Array) {
    const codec = Struct({
      txDetails: this.codec,
      sig: this.sigCodec,
    });
    try {
      const { txDetails, sig } = codec.dec(bytes);
      return <TransactionData<T>>{ ...txDetails, signature: sig };
    } catch (err) {
      return this.codec.dec(bytes);
    }
  }

  sign(rawTx: Uint8Array, signature: S) {
    const sig = this.sigCodec.enc(signature);
    return concatBytes(rawTx, sig);
  }
}

export default Transaction;
