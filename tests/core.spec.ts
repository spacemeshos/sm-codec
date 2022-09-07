import initBech32, { Bech32 } from '@spacemesh/address-wasm';
import { enhanceCodec, str } from 'scale-ts';
import { Address, Context, Nonce, Struct } from '../src/codecs/core';
import { HRP } from '../src/hrp';

describe('Core codecs', () => {
  describe('Struct & Address', () => {
    let b32: Bech32;
    let ctx: Context;
    const hrp = HRP.TestNet;
    beforeAll(async () => {
      b32 = await initBech32(hrp);
      ctx = {
        hrp: hrp,
        bech32: b32,
      };
    });

    it('Struct accept Codecs', () => {
      const codec = Struct({
        a: str,
      });
      const r = codec(ctx).enc({ a: 'test' });
      expect(str.dec(r)).toEqual('test');
    });
    it('Struct accept Context-dependent codec creators', () => {
      const codecCreator = Struct({
        a: (ctx) =>
          enhanceCodec(
            str,
            (x) => `${ctx.hrp}:${x}`,
            (x) => x.slice(ctx.hrp.length + 1)
          ),
      });
      const codec = codecCreator(ctx);
      const r = codec.enc({ a: 'test' });
      expect(codec.dec(r)).toEqual({ a: 'test' });
      expect(str.dec(r)).toEqual(`${hrp}:test`);
    });
    it('Struct can be nested and accept other codec creators like Address', () => {
      const a = Struct({
        addr: Address,
      });
      const codecCreator = Struct({
        a,
      });
      const codec = codecCreator(ctx);
      const o = {
        a: { addr: 'stest1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgf0ae28' },
      };
      const r = codec.enc(o);
      expect(codec.dec(r)).toEqual(o);
    });
  });
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
