import MultiSigAccount from '../src/std/multisig';
import { serializeBigInts } from './utils';

describe('MultiSigTemplate', () => {
  it('principal', () => {
    const pk1 = Uint8Array.from(new Array(32).fill(0));
    const pk2 = Uint8Array.from(new Array(32).fill(1));
    const tpl = MultiSigAccount.methods[0];
    const principal0 = tpl.principal({ Required: 1n, PublicKeys: [pk1] });
    const principal1 = tpl.principal({ Required: 1n, PublicKeys: [pk1, pk2] });
    const principal2 = tpl.principal({ Required: 2n, PublicKeys: [pk1, pk2] });

    expect(principal0).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 0, 103, 0, 55, 170, 33, 187, 2, 108, 114, 54, 238, 53, 6,
        37, 92, 141, 232, 87, 147,
      ])
    );
    expect(principal1).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 18, 208, 129, 242, 99, 143, 108, 60, 78, 223, 107, 133, 148,
        136, 33, 167, 245, 34, 11, 59,
      ])
    );
    expect(principal2).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 33, 55, 229, 172, 159, 13, 197, 85, 167, 212, 25, 209, 104,
        249, 209, 197, 75, 105, 138, 68,
      ])
    );
  });
  it('spawn', () => {
    const tpl = MultiSigAccount.methods[0];

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
  it('spend', () => {
    const tpl = MultiSigAccount.methods[16];
    const pk1 = Uint8Array.from(new Array(32).fill(0));
    const pk2 = Uint8Array.from(new Array(32).fill(1));
    const spawnArgs = { Required: 2n, PublicKeys: [pk1, pk2] };
    const principal = tpl.principal(spawnArgs);

    const fakeSignature = {
      Ref: 0n,
      Sig: Uint8Array.from(new Array(64).fill(7)),
    };
    const payload = {
      Arguments: {
        Destination: principal,
        Amount: 120n,
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
