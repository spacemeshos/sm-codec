import { Nonce } from '../src/codecs/core';

describe('Core codecs', () => {
  describe('Nonce', () => {
    const roundtripCase = (nonce: Nonce) => {
      it(`encodes & decodes { Counter: ${nonce.Counter}, Bitfield: ${nonce.Bitfield} }`, () => {
        const enc = Nonce.enc(nonce);
        expect(enc instanceof Uint8Array).toBeTruthy();
        const dec = Nonce.dec(enc);
        expect(dec).toEqual(nonce);
      });
    };

    roundtripCase({ Counter: 0n, Bitfield: 0n });
    roundtripCase({ Counter: 1n, Bitfield: 1n });
    roundtripCase({ Counter: 1000000n, Bitfield: 255n });
  });
});
