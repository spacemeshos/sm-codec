import { Bytes, compact, Struct } from 'scale-ts';
import withTemplateAddress from '../src/codecs/withTemplateAddress';

describe('withTemplateAddress', () => {
  const codec = Struct({
    a: Bytes(5),
    b: compact,
  });
  const tplAddress = Uint8Array.from([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ]);

  const wrapped = withTemplateAddress(tplAddress, codec);

  const data = { a: Uint8Array.from([1, 2, 3, 4, 5]), b: 1 };
  const dataEncoded = [1, 2, 3, 4, 5, 4];
  const dataEncodedWithAddress = Uint8Array.from([
    ...tplAddress,
    ...dataEncoded,
  ]);

  it('encodes with template address', () => {
    expect(wrapped.enc(data)).toEqual(dataEncodedWithAddress);
  });
  it('decodes without template address', () => {
    expect(wrapped.dec(dataEncodedWithAddress)).toEqual(data);
  });
});
