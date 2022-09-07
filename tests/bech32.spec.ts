import init, { Bech32 } from '@spacemesh/address-wasm';

// Not so much tests here, since @spacemesh/address-wasm
// has own tests for all exported functions. So this
// test case is mostly to ensure that WASM runs well.

describe('BECH32 Addresses', () => {
  let BECH32: Bech32;
  beforeAll(async () => {
    BECH32 = await init('sm');
    global.bech32 = BECH32;
  });

  const pubKey = Uint8Array.from([
    125, 44, 218, 64, 34, 174, 155, 203, 85, 178, 42, 154, 134, 113, 240, 191,
    212, 29, 209, 100, 78, 91, 133, 215, 219, 103, 73, 212, 109, 61, 53, 93,
  ]);

  it('works', () => {
    const r = BECH32.generateAddress(pubKey);
    expect(r).toHaveLength(48);
    expect(r.startsWith('sm')).toBeTruthy();
  });
});
