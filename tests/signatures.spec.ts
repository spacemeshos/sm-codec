import { MultiSigPart, Signatures } from '../src/codecs/signatures';

describe('Signatures', () => {
  it('encode variable length multisig', () => {
    expect(Signatures.enc([])).toEqual(new Uint8Array(0));
    expect(
      Signatures.enc([
        { Ref: BigInt(1), Sig: Uint8Array.from({ length: 64 }, () => 0) },
        { Ref: BigInt(3), Sig: Uint8Array.from({ length: 64 }, () => 1) },
        { Ref: BigInt(5), Sig: Uint8Array.from({ length: 64 }, () => 2) },
      ])
    ).toEqual(
      Uint8Array.from([
        /* eslint-disable prettier/prettier */
        4,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
        12,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
        20,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
        /* eslint-enable prettier/prettier */
      ])
    );
  });
  it('encode->decode', () => {
    const check = (input: MultiSigPart[]) => {
      expect(Signatures.dec(Signatures.enc(input))).toEqual(input);
    };

    check([]);
    check([
      { Ref: BigInt(1), Sig: Uint8Array.from({ length: 64 }, () => 0) },
      { Ref: BigInt(4), Sig: Uint8Array.from({ length: 64 }, () => 1) },
      { Ref: BigInt(10), Sig: Uint8Array.from({ length: 64 }, () => 2) },
    ]);
    check([
      { Ref: BigInt(1), Sig: Uint8Array.from({ length: 64 }, () => 0) },
      { Ref: BigInt(2), Sig: Uint8Array.from({ length: 64 }, () => 1) },
      { Ref: BigInt(3), Sig: Uint8Array.from({ length: 64 }, () => 2) },
      { Ref: BigInt(4), Sig: Uint8Array.from({ length: 64 }, () => 3) },
      { Ref: BigInt(5), Sig: Uint8Array.from({ length: 64 }, () => 3) },
      { Ref: BigInt(6), Sig: Uint8Array.from({ length: 64 }, () => 4) },
      { Ref: BigInt(7), Sig: Uint8Array.from({ length: 64 }, () => 255) },
    ]);
  });
});
