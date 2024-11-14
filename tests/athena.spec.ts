import { computePrincipal } from '../src/athena/principal';
import {
  TEMPLATE_PUBKEY,
  PrincipalSpawnArgs,
  SpawnPayload,
  SpendPayload,
  METHODS_HEX,
} from '../src/athena/wallet';
import { Tx as Athena, Templates } from '../src/athena';
import { HexString, hexToBytes } from '../src/utils/hex';

describe('Athena/Wallet', () => {
  const pubkeys = [
    'f6bec05666f283c01f51ac9213d536dda6b80a8018cd8342c5deb710c49ebaaf',
    '9dff74f69ac4cec11bfada720ba6d4921f055c44325658f545a710f5c13554a2',
    'b3f914dd6900835da712d79cfee7c571edb39e78fc30fa2d2fb0e5f89f97ff58',
  ];
  const addresses = [
    [
      0, 0, 0, 0, 174, 95, 18, 201, 13, 221, 194, 216, 132, 50, 205, 191, 246,
      12, 115, 138, 244, 103, 7, 237,
    ],
    [
      0, 0, 0, 0, 128, 74, 119, 204, 231, 150, 159, 15, 14, 187, 27, 172, 17,
      89, 153, 135, 232, 233, 39, 59,
    ],
    [
      0, 0, 0, 0, 44, 107, 128, 244, 137, 54, 223, 235, 64, 170, 68, 12, 19,
      117, 148, 184, 120, 115, 112, 213,
    ],
  ];

  describe('compute principal', () => {
    const checkPrincipal = (pubKey: HexString, bytes: number[]) => {
      it(pubKey, () => {
        expect(
          computePrincipal(
            TEMPLATE_PUBKEY,
            PrincipalSpawnArgs.enc({
              Nonce: 0n,
              Balance: 0n,
              Payload: hexToBytes(pubKey),
            })
          )
        ).toEqual(Uint8Array.from(bytes));
      });
    };

    checkPrincipal(pubkeys[0], addresses[0]);
    checkPrincipal(pubkeys[1], addresses[1]);
    checkPrincipal(pubkeys[2], addresses[2]);
  });

  describe('spawn tx', () => {
    describe('encode', () => {
      const checkSpawn = (
        idx: number,
        sig: HexString,
        goldenHex: HexString
      ) => {
        it(pubkeys[idx], () => {
          const spawnPayload = SpawnPayload.enc({
            PubKey: hexToBytes(pubkeys[idx]),
          });
          const tx = Athena.enc({
            Version: 1n,
            Principal: Uint8Array.from(addresses[idx]),
            Nonce: 0n,
            GasPrice: 1n,
            Payload: [...spawnPayload],
            Signature: Buffer.from(sig, 'hex'),
          });

          expect(tx).toEqual(hexToBytes(goldenHex));
        });
      };

      /* eslint-disable max-len */
      checkSpawn(
        0,
        '9d4071916ce4f0d3dd7d0928ffed5bf6f9d24c73f82fe7629e7b3fdb953a76c4e315d33012dcf59f8b9dea823b900af518531697f658a1470c99e98371afb70f',
        '0400000000ae5f12c90dddc2d88432cdbff60c738af46707ed0004980103f53f2080f6bec05666f283c01f51ac9213d536dda6b80a8018cd8342c5deb710c49ebaaf9d4071916ce4f0d3dd7d0928ffed5bf6f9d24c73f82fe7629e7b3fdb953a76c4e315d33012dcf59f8b9dea823b900af518531697f658a1470c99e98371afb70f'
      );
      checkSpawn(
        1,
        'fcac27b0e2a11d66e4410987e7de00b490d319c23d307e07d2811da3b9aa6485c52fc3f7afc58a4f94be0950cc3863d3203e3c3d7bb9635b274a02421363e502',
        '0400000000804a77cce7969f0f0ebb1bac11599987e8e9273b0004980103f53f20809dff74f69ac4cec11bfada720ba6d4921f055c44325658f545a710f5c13554a2fcac27b0e2a11d66e4410987e7de00b490d319c23d307e07d2811da3b9aa6485c52fc3f7afc58a4f94be0950cc3863d3203e3c3d7bb9635b274a02421363e502'
      );
      checkSpawn(
        2,
        '0f6dbdd3a9f7ba34f92d075bfcf312f877d81a47d60cf3c2d4ecce71cd03db08b85a9a640a4f2e172429c5ec98a1f9047a5ec625a7dff3dd9a5fc98937d9e202',
        '04000000002c6b80f48936dfeb40aa440c137594b8787370d50004980103f53f2080b3f914dd6900835da712d79cfee7c571edb39e78fc30fa2d2fb0e5f89f97ff580f6dbdd3a9f7ba34f92d075bfcf312f877d81a47d60cf3c2d4ecce71cd03db08b85a9a640a4f2e172429c5ec98a1f9047a5ec625a7dff3dd9a5fc98937d9e202'
      );
      /* eslint-enable max-len */
    });
    describe('decode->encode roundtrip', () => {
      const checkRoundtrip = (idx: number, goldenTx: HexString) => {
        it(`${idx}: ${goldenTx.slice(0, 29)}...${goldenTx.slice(-29)}`, () => {
          const tx = Athena.dec(goldenTx);
          const args = SpawnPayload.dec(Uint8Array.from(tx.Payload));
          expect(args).toEqual({
            PubKey: hexToBytes(pubkeys[idx]),
          });
          const encArgs = SpawnPayload.enc(args);
          expect(encArgs).toEqual(Uint8Array.from(tx.Payload));
          const encTx = Athena.enc({
            Version: 1n,
            Principal: tx.Principal,
            Nonce: tx.Nonce,
            GasPrice: tx.GasPrice,
            Payload: [...encArgs],
            Signature: tx.Signature,
          });
          expect(Buffer.from(encTx).toString('hex')).toEqual(goldenTx);
        });
      };

      /* eslint-disable max-len */
      checkRoundtrip(
        0,
        '0400000000ae5f12c90dddc2d88432cdbff60c738af46707ed0004980103f53f2080f6bec05666f283c01f51ac9213d536dda6b80a8018cd8342c5deb710c49ebaaf9d4071916ce4f0d3dd7d0928ffed5bf6f9d24c73f82fe7629e7b3fdb953a76c4e315d33012dcf59f8b9dea823b900af518531697f658a1470c99e98371afb70f'
      );
      checkRoundtrip(
        1,
        '0400000000804a77cce7969f0f0ebb1bac11599987e8e9273b0004980103f53f20809dff74f69ac4cec11bfada720ba6d4921f055c44325658f545a710f5c13554a2fcac27b0e2a11d66e4410987e7de00b490d319c23d307e07d2811da3b9aa6485c52fc3f7afc58a4f94be0950cc3863d3203e3c3d7bb9635b274a02421363e502'
      );
      checkRoundtrip(
        2,
        '04000000002c6b80f48936dfeb40aa440c137594b8787370d50004980103f53f2080b3f914dd6900835da712d79cfee7c571edb39e78fc30fa2d2fb0e5f89f97ff580f6dbdd3a9f7ba34f92d075bfcf312f877d81a47d60cf3c2d4ecce71cd03db08b85a9a640a4f2e172429c5ec98a1f9047a5ec625a7dff3dd9a5fc98937d9e202'
      );
      /* eslint-enable max-len */
    });
  });

  describe('spend tx', () => {
    const goldenTx =
      // eslint-disable-next-line max-len
      '0400000000ae5f12c90dddc2d88432cdbff60c738af46707ed136645961129cc0db3049801fb1784308000000000ae5f12c90dddc2d88432cdbff60c738af46707edc3aa4a81e7ca43fbd70bb2b1c4ad5a8bd2d6c4e21a8a19031d1f8c9074776ab2b3ad9aa3f04d6561a4018d8a56153cd2ac16bf56eb6c9bc167030964d92cef5ec08a844dc018cd04';

    it('works', () => {
      const spendPayload = SpendPayload.enc({
        Recipient: Uint8Array.from(addresses[0]),
        Amount: 18105538022614936259n,
      });

      const tx = Athena.enc({
        Version: 1n,
        Principal: Uint8Array.from(addresses[0]),
        Nonce: 12902192984247125350n,
        GasPrice: 1n,
        Payload: [...spendPayload],
        Signature: Buffer.from(
          // eslint-disable-next-line max-len
          'd70bb2b1c4ad5a8bd2d6c4e21a8a19031d1f8c9074776ab2b3ad9aa3f04d6561a4018d8a56153cd2ac16bf56eb6c9bc167030964d92cef5ec08a844dc018cd04',
          'hex'
        ),
      });
      expect(tx).toEqual(hexToBytes(goldenTx));
    });
    it('roundtrip', () => {
      const tx = Athena.dec(goldenTx);
      const payload = SpendPayload.dec(Uint8Array.from(tx.Payload));
      expect(payload).toEqual({
        Recipient: Uint8Array.from(addresses[0]),
        Amount: 18105538022614936259n,
      });
      const encPayload = SpendPayload.enc(payload);
      expect(encPayload).toEqual(Uint8Array.from(tx.Payload));
      const encTx = Athena.enc({
        Version: 1n,
        Principal: tx.Principal,
        Nonce: tx.Nonce,
        GasPrice: tx.GasPrice,
        Payload: [...encPayload],
        Signature: tx.Signature,
      });
      expect(Buffer.from(encTx).toString('hex')).toEqual(goldenTx);
    });
  });

  describe('By Templates', () => {
    describe('Wallet', () => {
      it('principal', () => {
        const addr = Templates[
          '000000000000000000000000000000000000000000000001'
        ].principal({
          Nonce: 0n,
          Balance: 0n,
          Payload: hexToBytes(pubkeys[0]),
        });
        expect([...addr]).toEqual(addresses[0]);
      });

      it('methods[spawn]', () => {
        const tx = Templates[
          '000000000000000000000000000000000000000000000001'
        ].methods[METHODS_HEX.SPAWN].enc({
          Version: 1n,
          Principal: Uint8Array.from(addresses[0]),
          Nonce: 0n,
          GasPrice: 1n,
          Payload: {
            PubKey: hexToBytes(pubkeys[0]),
          },
          Signature: Buffer.from(
            // eslint-disable-next-line max-len
            '9d4071916ce4f0d3dd7d0928ffed5bf6f9d24c73f82fe7629e7b3fdb953a76c4e315d33012dcf59f8b9dea823b900af518531697f658a1470c99e98371afb70f',
            'hex'
          ),
        });

        expect(tx).toEqual(
          hexToBytes(
            // eslint-disable-next-line max-len
            '0400000000ae5f12c90dddc2d88432cdbff60c738af46707ed0004980103f53f2080f6bec05666f283c01f51ac9213d536dda6b80a8018cd8342c5deb710c49ebaaf9d4071916ce4f0d3dd7d0928ffed5bf6f9d24c73f82fe7629e7b3fdb953a76c4e315d33012dcf59f8b9dea823b900af518531697f658a1470c99e98371afb70f'
          )
        );
      });

      it('methods[spend]', () => {
        const tx = Templates[
          '000000000000000000000000000000000000000000000001'
        ].methods[METHODS_HEX.SPEND].enc({
          Version: 1n,
          Principal: Uint8Array.from(addresses[0]),
          Nonce: 12902192984247125350n,
          GasPrice: 1n,
          Payload: {
            Recipient: Uint8Array.from(addresses[0]),
            Amount: 18105538022614936259n,
          },
          Signature: Buffer.from(
            // eslint-disable-next-line max-len
            'd70bb2b1c4ad5a8bd2d6c4e21a8a19031d1f8c9074776ab2b3ad9aa3f04d6561a4018d8a56153cd2ac16bf56eb6c9bc167030964d92cef5ec08a844dc018cd04',
            'hex'
          ),
        });

        expect(tx).toEqual(
          hexToBytes(
            // eslint-disable-next-line max-len
            '0400000000ae5f12c90dddc2d88432cdbff60c738af46707ed136645961129cc0db3049801fb1784308000000000ae5f12c90dddc2d88432cdbff60c738af46707edc3aa4a81e7ca43fbd70bb2b1c4ad5a8bd2d6c4e21a8a19031d1f8c9074776ab2b3ad9aa3f04d6561a4018d8a56153cd2ac16bf56eb6c9bc167030964d92cef5ec08a844dc018cd04'
          )
        );
      });
    });
  });
});
