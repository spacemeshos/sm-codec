import { Bech32 } from '@spacemesh/address-wasm';
import {
  Bytes,
  Codec,
  enhanceCodec,
  StringRecord,
  Struct as _Struct,
} from 'scale-ts';
import { HRP } from '../hrp';
import { HexString } from '../utils/hex';
import { Compact32, Compact8 } from './compact';

export type Context = {
  hrp: HRP;
  bech32: Bech32;
};

export type CodecType<T> = T extends Codec<infer R>
  ? R
  : T extends (ctx: Context) => Codec<infer R>
  ? R
  : never;

interface StructCreator {
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    A extends StringRecord<Codec<any> | ((ctx: Context) => Codec<any>)>,
    OT extends {
      [K in keyof A]: A[K] extends Codec<infer D>
        ? D
        : A[K] extends (ctx: Context) => Codec<infer D>
        ? D
        : unknown;
    }
  >(
    codecs: A
  ): (ctx: Context) => Codec<OT>;
}

export const Struct: StructCreator = (shape) => (ctx) => {
  const _shape = Object.fromEntries(
    Object.entries(shape).map(([key, codec]) => {
      if (typeof codec === 'function') {
        return [key, codec(ctx)];
      } else {
        return [key, codec];
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as StringRecord<Codec<any>>;
  return _Struct(_shape);
};

export const Constant = <A>(codec: Codec<A>, value: A) => [
  codec.dec,
  () => codec.enc(value),
];

//

export const Address = (ctx: Context) =>
  enhanceCodec(
    Bytes(24),
    (addr: HexString) => ctx.bech32.parse(addr, ctx.hrp),
    (bytes: Uint8Array) => ctx.bech32.generateAddress(bytes, ctx.hrp)
  );
export type Address = CodecType<ReturnType<typeof Address>>;

export const PublicKey = Bytes(32);
export type PublicKey = CodecType<typeof PublicKey>;

export const Nonce = _Struct({
  Counter: Compact32,
  Bitfield: Compact8,
});
export type Nonce = CodecType<typeof Nonce>;

export const GasPrice = Compact32;
export type GasPrice = CodecType<typeof GasPrice>;
