import {
  Bytes,
  Codec,
  createCodec,
  Option,
  Struct,
  u8,
  Vector,
} from 'scale-ts';

const vecU8 = Vector(u8);

const Variable = <T>(codec: Codec<T>) =>
  createCodec(
    (value: T) => vecU8.enc([...codec.enc(value)]),
    (bytes) => codec.dec(Uint8Array.from(vecU8.dec(bytes)))
  );

const PayloadCodec = <T>(ArgsCodec: Codec<T>) =>
  Struct({
    MethodSelector: Option(Bytes(4)),
    Args: Variable(ArgsCodec),
  });

const WithMethodSelector = <T>(
  methodSelector: Uint8Array,
  ArgsCodec: Codec<T>
) =>
  createCodec<T>(
    (args: T) =>
      PayloadCodec(ArgsCodec).enc({
        MethodSelector: methodSelector,
        Args: args,
      }),
    (bytes) => PayloadCodec(ArgsCodec).dec(bytes).Args
  );

export default WithMethodSelector;
