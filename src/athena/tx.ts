import {
  Bytes,
  Codec,
  CodecType,
  createCodec,
  Struct,
  u8,
  Vector,
} from 'scale-ts';
import { Address, Compact64, Compact8 } from '../codecs';

const AthenaTx = Struct({
  Version: Compact8,
  Principal: Address,
  Nonce: Compact64,
  GasPrice: Compact64,
  Payload: Vector(u8),
  Signature: Bytes(64), // TODO: Add support of MultiSig?
});

export type AthenaTx = CodecType<typeof AthenaTx>;
export type Athena<T> = Omit<AthenaTx, 'Payload'> & { Payload: T };

export const Wrap = <T>(PayloadCodec: Codec<T>): Codec<Athena<T>> =>
  createCodec(
    (data: Athena<T>) => {
      const payload = PayloadCodec.enc(data.Payload);
      return AthenaTx.enc({ ...data, Payload: [...payload] });
    },
    (bytes) => {
      const tx = AthenaTx.dec(bytes);
      const payload = PayloadCodec.dec(Uint8Array.from(tx.Payload));
      return { ...tx, Payload: payload };
    }
  );

export default AthenaTx;
