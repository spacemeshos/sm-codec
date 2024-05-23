import { Signatures } from '../src/codecs/signatures';

describe('Signatures', () => {
  it('encode variable length multisig', () => {
    expect(Signatures.enc([])).toEqual(new Uint8Array(0));
    expect(
      Signatures.enc([
        Uint8Array.from({ length: 64 }, () => 0),
        Uint8Array.from({ length: 64 }, () => 1),
        Uint8Array.from({ length: 64 }, () => 2),
      ])
    ).toEqual(
      Uint8Array.from([
        /* eslint-disable prettier/prettier */
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
        /* eslint-enable prettier/prettier */
      ])
    );
  });
  it('encode->decode', () => {
    const check = (input: Uint8Array[]) => {
      expect(Signatures.dec(Signatures.enc(input))).toEqual(input);
    };

    check([]);
    check([
      Uint8Array.from({ length: 64 }, () => 0),
      Uint8Array.from({ length: 64 }, () => 1),
      Uint8Array.from({ length: 64 }, () => 2),
    ]);
    check([
      Uint8Array.from({ length: 64 }, () => 0),
      Uint8Array.from({ length: 64 }, () => 1),
      Uint8Array.from({ length: 64 }, () => 2),
      Uint8Array.from({ length: 64 }, () => 3),
      Uint8Array.from({ length: 64 }, () => 3),
      Uint8Array.from({ length: 64 }, () => 4),
      Uint8Array.from({ length: 64 }, () => 255),
    ]);
  });
});
