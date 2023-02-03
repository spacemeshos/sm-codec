import { Nonce } from '../src/codecs/core';

describe('Core codecs', () => {
  describe('Nonce', () => {
    const roundtripCase = (nonce: Nonce) => {
      it(`encodes & decodes ${String(nonce)}`, () => {
        const enc = Nonce.enc(nonce);
        expect(enc instanceof Uint8Array).toBeTruthy();
        const dec = Nonce.dec(enc);
        expect(dec).toEqual(nonce);
      });
    };

    roundtripCase(25n);
    roundtripCase(1n);
    roundtripCase(0n);
    roundtripCase(100000000n);
  });
});
