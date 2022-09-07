import { Address, Context } from './codecs/core';
import { Uint8 } from './utils/uints';
import { SingleSig, MultiSig, isMultiSigData } from './codecs/signatures';
import { Codec, Struct } from 'scale-ts';
import TxCodec from './codecs/tx';
import { concatBytes } from './utils/bytes';
import { sha256 } from './utils/crypto';
import { deriveHrpFromAddress, HRP } from './hrp';
import { Bech32 } from '@spacemesh/address-wasm';

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

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

class Transaction<
  T extends Payload,
  S extends Codec<SingleSig> | Codec<MultiSig>
> {
  private type = 0n;
  private hrp: HRP;
  private address: Address;
  private mehtodSelector: bigint;
  public payloadCodec: Codec<T> | ((ctx: Context) => Codec<T>);
  private codec: Codec<TransactionData<T>>;
  private sigCodec: S;
  private context: Context;

  constructor(
    {
      address,
      methodSelector,
      payloadCodec,
      sigCodec,
    }: {
      address: Address;
      methodSelector: number;
      payloadCodec: Codec<T> | ((ctx: Context) => Codec<T>);
      sigCodec: S;
    },
    bech32: Bech32
  ) {
    this.address = address;
    this.hrp = deriveHrpFromAddress(address);
    this.mehtodSelector = BigInt(methodSelector);
    this.payloadCodec = payloadCodec;
    this.sigCodec = sigCodec;
    this.context = {
      hrp: this.hrp,
      bech32,
    };
    this.codec = TxCodec(this.payloadCodec)(this.context);
  }

  encode(principal: string, payload: T) {
    return this.codec.enc({
      TransactionType: 0n,
      Principal: principal,
      MethodSelector: this.mehtodSelector,
      Payload: payload,
    });
  }
  principal(hrp: string, spawnPayload: Optional<T, 'TemplateAddress'>) {
    if (this.mehtodSelector !== 0n) {
      // TODO: Support Spawn Transactions
      throw new Error(
        'Principal address can be computed from Self-Spawn Transaction only'
      );
    }
    const payloadCodec =
      typeof this.payloadCodec === 'function'
        ? this.payloadCodec(this.context)
        : this.payloadCodec;

    const bytes = concatBytes(
      Address(this.context).enc(this.address),
      (payloadCodec as unknown as Codec<SpawnPayload>).enc({
        TemplateAddress: this.address,
        Arguments: spawnPayload.Arguments,
      } as SpawnPayload)
    );
    const addr = sha256(bytes).slice(12);
    return this.context.bech32.generateAddress(addr, this.hrp);
  }
  decode(bytes: Uint8Array) {
    const codec = Struct({
      txDetails: this.codec,
      sig: this.sigCodec,
    });
    try {
      const { txDetails, sig } = codec.dec(bytes);
      return { ...txDetails, signature: sig };
    } catch (err) {
      return this.codec.dec(bytes);
    }
  }

  private _getSignBytes(signature: SingleSig | MultiSig) {
    if (this.sigCodec === SingleSig && signature instanceof Uint8Array) {
      return this.sigCodec.enc(signature);
    } else if (isMultiSigData(signature)) {
      return (this.sigCodec as Codec<MultiSig>).enc(signature);
    } else {
      const isSingleSigCodec = this.sigCodec === SingleSig;
      const isSingleSigData = signature instanceof Uint8Array;
      throw new Error(
        `Can not sign transaction: using ${
          isSingleSigCodec ? 'SingleSig' : 'MultiSig'
        } codec, but got ${
          isSingleSigData ? 'SingleSig' : 'MultiSig'
        } data: ${JSON.stringify(signature)}`
      );
    }
  }
  sign(rawTx: Uint8Array, signature: SingleSig | MultiSig) {
    const sig = this._getSignBytes(signature);
    return concatBytes(rawTx, sig);
  }
}

export default Transaction;
