import VestingTpl from '../src/std/vesting';
import { serializeBigInts } from './utils';

describe('VestingTemplate', () => {
  it('principal', () => {
    const pk1 = Uint8Array.from(new Array(32).fill(0));
    const pk2 = Uint8Array.from(new Array(32).fill(1));
    const tpl = VestingTpl.methods[0];
    const principal0 = tpl.principal({ Required: 1n, PublicKeys: [pk1] });
    const principal1 = tpl.principal({ Required: 1n, PublicKeys: [pk1, pk2] });
    const principal2 = tpl.principal({ Required: 2n, PublicKeys: [pk1, pk2] });

    expect(principal0).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 231, 95, 174, 188, 143, 109, 173, 51, 182, 179, 255, 217, 224, 124, 45, 90, 169, 170, 31, 211
      ])
    );
    expect(principal1).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 88, 148, 144, 14, 42, 122, 93, 94, 166, 72, 155, 132, 184, 29, 214, 51, 77, 3, 50, 111
      ])
    );
    expect(principal2).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 234, 242, 113, 169, 206, 0, 235, 238, 60, 151, 125, 116, 185, 226, 199, 118, 208, 20, 228, 2
      ])
    );
  });
  it('self-spawn', () => {
    const tpl = VestingTpl.methods[0];

    const pk1 = Uint8Array.from(new Array(32).fill(0));
    const pk2 = Uint8Array.from(new Array(32).fill(1));
    const spawnArgs = { Required: 2n, PublicKeys: [pk1, pk2] };
    const principal = tpl.principal(spawnArgs);
    const encodedByTpl = tpl.encode(principal, {
      Nonce: 0n,
      GasPrice: 1n,
      Arguments: spawnArgs,
    });

    const fakeSignature = {
      Ref: 0n,
      Sig: Uint8Array.from(new Array(64).fill(7)),
    };
    const encodedAndSigned = tpl.sign(encodedByTpl, [fakeSignature]);
    const tx = tpl.decode(encodedAndSigned);
    expect(serializeBigInts(tx)).toEqual(
      serializeBigInts({
        TransactionType: 0n,
        Principal: principal,
        MethodSelector: 0n,
        Payload: {
          Nonce: 0n,
          GasPrice: 1n,
          Arguments: {
            Required: 2n,
            PublicKeys: [pk1, pk2],
          },
        },
        Signatures: [fakeSignature],
      })
    );
  });
  it('drain', () => {
    const tpl = VestingTpl.methods[17];
    const pk1 = Uint8Array.from(new Array(32).fill(0));
    const pk2 = Uint8Array.from(new Array(32).fill(1));
    const spawnArgs = { Required: 2n, PublicKeys: [pk1, pk2] };
    const principal = tpl.principal(spawnArgs);
    const vaultAddr = Uint8Array.from(new Array(24).fill(9));
    const destnAddr = Uint8Array.from(new Array(24).fill(3));

    const fakeSignature = {
      Ref: 0n,
      Sig: Uint8Array.from(new Array(64).fill(7)),
    };
    const payload = {
      Arguments: {
        Vault: vaultAddr,
        Destination: destnAddr,
        Amount: 10n ** 9n, // 1 SMH
      },
      Nonce: 1n,
      GasPrice: 1n,
    };
    const tx = tpl.encode(principal, payload);
    const signedTx = tpl.sign(tx, [fakeSignature]);

    const actual = tpl.decode(signedTx);

    expect(principal).toEqual(principal);
    expect(serializeBigInts(actual.Payload)).toEqual(serializeBigInts(payload));
    expect(actual.Signatures).toEqual([fakeSignature]);
  });
});
