import { Codec, createCodec, Struct } from 'scale-ts';
import { concatBytes } from '../utils/bytes';
import { Address } from './core';

const withAddressCodec = <T>(codec: Codec<T>) =>
  Struct({
    TemplateAddress: Address,
    rest: codec,
  });

const getRestFields = <T>({
  TemplateAddress, // eslint-disable-line @typescript-eslint/no-unused-vars
  rest,
}: {
  TemplateAddress: Uint8Array;
  rest: T;
}) => rest;

const withTemplateAddress = <T extends Record<string, unknown>>(
  address: Uint8Array,
  payloadCodec: Codec<T>
) =>
  createCodec(
    (value: T) => concatBytes(address, payloadCodec.enc(value)),
    (bytes) => getRestFields(withAddressCodec(payloadCodec).dec(bytes)) as T
  );

export default withTemplateAddress;
