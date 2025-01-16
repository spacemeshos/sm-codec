import { bech32 } from 'bech32';

import {
  SpawnPayload,
  SpendPayload,
  METHODS_HEX,
  principal,
  TEMPLATE_PUBKEY,
  DeployPayload,
  TEMPLATE_PUBKEY_HEX,
} from '../src/athena/wallet';
import { Tx as Athena, Templates } from '../src/athena';
import { HexString, hexToBytes } from '../src/utils/hex';
import Signature from '../src/athena/signature';
import { bytesToHex } from '@noble/hashes/utils';
import AthenaTx, { Athena as AthenaT } from '../src/athena/tx';

describe('Athena', () => {
  describe('Signature', () => {
    it('encodes and decodes signature correctly', () => {
      const signature = Uint8Array.from(
        Buffer.from(
          // eslint-disable-next-line max-len
          'd70bb2b1c4ad5a8bd2d6c4e21a8a19031d1f8c9074776ab2b3ad9aa3f04d6561a4018d8a56153cd2ac16bf56eb6c9bc167030964d92cef5ec08a844dc018cd04',
          'hex'
        )
      );
      const encodedSignature = Signature.enc(signature);
      const decodedSignature = Signature.dec(encodedSignature);
      expect(decodedSignature).toEqual(
        Uint8Array.from([
          0xd7, 0x0b, 0xb2, 0xb1, 0xc4, 0xad, 0x5a, 0x8b, 0xd2, 0xd6, 0xc4,
          0xe2, 0x1a, 0x8a, 0x19, 0x03, 0x1d, 0x1f, 0x8c, 0x90, 0x74, 0x77,
          0x6a, 0xb2, 0xb3, 0xad, 0x9a, 0xa3, 0xf0, 0x4d, 0x65, 0x61, 0xa4,
          0x01, 0x8d, 0x8a, 0x56, 0x15, 0x3c, 0xd2, 0xac, 0x16, 0xbf, 0x56,
          0xeb, 0x6c, 0x9b, 0xc1, 0x67, 0x03, 0x09, 0x64, 0xd9, 0x2c, 0xef,
          0x5e, 0xc0, 0x8a, 0x84, 0x4d, 0xc0, 0x18, 0xcd, 0x04,
        ])
      );
    });
    it('ecndoes and decodes null correctly', () => {
      const enc = Signature.enc(null);
      const dec = Signature.dec(enc);
      expect(dec).toBeNull();
    });
  });
  describe('Wallet', () => {
    const pubkeys = [
      '97f3bd871315281e8b83edc7a9fd0541066154449070ccdb3cdd42cf69ccde88',
      '6f1581709bb7b1ef030d210db18e3b0ba1c776fba65d8cdaad05415142d189f8',
      '8ed90420802c83b41e4a7fa94ce5f05792ea8bff3d7a63572e5c73454eaef51d',
    ];
    const addresses = [
      'atest1qqqqqqxe5595qhny70u0cwxustr0x6p0lsjuvxqtelrnw',
      'atest1qqqqqq9m8gf7msckcmvak0uvy6kkyvt8z65873g0k0mlp',
      'atest1qqqqqqr87as4czxe65yvnrvstnxyjesgvt59aecaczffc',
    ].map((addr) => bech32.fromWords(bech32.decode(addr).words));

    describe('principal', () => {
      const checkPrincipal = (pubKey: HexString, bytes: number[]) => {
        it(pubKey, () => {
          expect(principal({ PubKey: hexToBytes(pubKey) })).toEqual(
            Uint8Array.from(bytes)
          );
        });
      };
      checkPrincipal(pubkeys[0], addresses[0]);
      checkPrincipal(pubkeys[1], addresses[1]);
      checkPrincipal(pubkeys[2], addresses[2]);

      it('Templates[].principal()', () => {
        const addr = Templates[TEMPLATE_PUBKEY_HEX].principal({
          PubKey: hexToBytes(pubkeys[0]),
        });
        expect([...addr]).toEqual(addresses[0]);
      });
    });

    describe('spawn tx', () => {
      describe('encode', () => {
        const checkSpawn = (idx: number, goldenHex: HexString) => {
          it(pubkeys[idx], () => {
            const spawnPayload = SpawnPayload.enc({
              PubKey: hexToBytes(pubkeys[idx]),
            });
            const tx = AthenaTx.enc({
              Version: 1n,
              Principal: Uint8Array.from(addresses[idx]),
              TemplateAddress: TEMPLATE_PUBKEY,
              Nonce: 0n,
              GasPrice: 1n,
              Payload: [...spawnPayload],
              Signature: Uint8Array.from([]),
            });
            expect(bytesToHex(tx)).toEqual(goldenHex);
          });
        };

        /* eslint-disable max-len */
        checkSpawn(
          0,
          '0400000000d9a50b405e64f3f8fc38dc82c6f3682ffc25c618010000000000000000000000000000000000000000000000010004980103f53f208097f3bd871315281e8b83edc7a9fd0541066154449070ccdb3cdd42cf69ccde88'
        );
        checkSpawn(
          1,
          '0400000000bb3a13edc316c6d9db3f8c26ad62316716a87f45010000000000000000000000000000000000000000000000010004980103f53f20806f1581709bb7b1ef030d210db18e3b0ba1c776fba65d8cdaad05415142d189f8'
        );
        checkSpawn(
          2,
          '040000000067f7615c08d9d508c98d905ccc49660862e85ee7010000000000000000000000000000000000000000000000010004980103f53f20808ed90420802c83b41e4a7fa94ce5f05792ea8bff3d7a63572e5c73454eaef51d'
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
              TemplateAddress: TEMPLATE_PUBKEY,
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
          '0400000000d9a50b405e64f3f8fc38dc82c6f3682ffc25c618010000000000000000000000000000000000000000000000010004980103f53f208097f3bd871315281e8b83edc7a9fd0541066154449070ccdb3cdd42cf69ccde882fbb95cf9fc36d4991abcca13fb487b0b32b17c54048952018e53d60005425a995941b31ef79621fec3b2db8f3b67e547497e1c5c87a069e1fd9327a63cb0201'
        );
        checkRoundtrip(
          1,
          '0400000000bb3a13edc316c6d9db3f8c26ad62316716a87f45010000000000000000000000000000000000000000000000010004980103f53f20806f1581709bb7b1ef030d210db18e3b0ba1c776fba65d8cdaad05415142d189f8efdb536094653fdd6bd80ae58631b20ee89601826925d2e18602c5d1f58a700ebda8d8e064db8d374197f574844ae59571242bd75a4718d7af83d5f7b3366303'
        );
        checkRoundtrip(
          2,
          '040000000067f7615c08d9d508c98d905ccc49660862e85ee7010000000000000000000000000000000000000000000000010004980103f53f20808ed90420802c83b41e4a7fa94ce5f05792ea8bff3d7a63572e5c73454eaef51dc6bc32a02bb3de85b63926e8ec8fd722b42836ecfb9c5ce30a1967285882354ef2b6048e3f1b46d67158f12b1cbc722763aac89f404959dbf47690609cfd1c09'
        );
        /* eslint-enable max-len */
      });

      it('Templates[].methods[spawn]()', () => {
        const tx = Templates[TEMPLATE_PUBKEY_HEX].methods[
          METHODS_HEX.SPAWN
        ].enc({
          Version: 1n,
          Principal: Uint8Array.from(addresses[0]),
          TemplateAddress: TEMPLATE_PUBKEY,
          Nonce: 0n,
          GasPrice: 1n,
          Payload: {
            PubKey: hexToBytes(pubkeys[0]),
          },
          Signature: Buffer.from([]),
        });

        expect(tx).toEqual(
          hexToBytes(
            // eslint-disable-next-line max-len
            '0400000000d9a50b405e64f3f8fc38dc82c6f3682ffc25c618010000000000000000000000000000000000000000000000010004980103f53f208097f3bd871315281e8b83edc7a9fd0541066154449070ccdb3cdd42cf69ccde88'
          )
        );
      });
    });

    describe('spend tx', () => {
      const goldenTx =
        // eslint-disable-next-line max-len
        '0400000000d9a50b405e64f3f8fc38dc82c6f3682ffc25c618005d05049801fb178430808aa90b00997594fb45c2e995df5caa8286e21b692711f1a4fa83000000000000056a48dcfaae0acaeacdcca17256a318ac2aa7d1d29790057a6463b5dd007a963a6e9eae94206b9fc9e372766ba1de0e079e8abe266a54fa76409778baee1504';
      const sig =
        // eslint-disable-next-line max-len
        '056a48dcfaae0acaeacdcca17256a318ac2aa7d1d29790057a6463b5dd007a963a6e9eae94206b9fc9e372766ba1de0e079e8abe266a54fa76409778baee1504';

      const Recipient = Uint8Array.from(
        bech32.fromWords(
          bech32.decode('atest1325skqyewk20k3wzax2a7h92s2rwyxmfyuglrfqq0ty92')
            .words
        )
      );
      const payload = {
        Recipient,
        Amount: 33786n,
      };
      const txData: AthenaT<null> = {
        Version: 1n,
        Principal: Uint8Array.from(addresses[0]),
        TemplateAddress: undefined,
        Nonce: 343n,
        GasPrice: 1n,
        Payload: null,
        Signature: hexToBytes(sig),
      };

      it('encodes', () => {
        const spendPayload = SpendPayload.enc(payload);
        const tx = Athena.enc({
          ...txData,
          Payload: [...spendPayload],
        });
        expect(bytesToHex(tx)).toEqual(goldenTx);
      });
      it('decodes', () => {
        const tx = Athena.dec(goldenTx);
        const decodedPayload = SpendPayload.dec(Uint8Array.from(tx.Payload));
        expect(decodedPayload).toEqual({
          Recipient,
          Amount: 33786n,
        });
      });
      it('Templates[].methods[spend]()', () => {
        const codec = Templates[TEMPLATE_PUBKEY_HEX].methods[METHODS_HEX.SPEND];
        const txEncoded = codec.enc({
          ...txData,
          Payload: payload,
        });
        expect(bytesToHex(txEncoded)).toEqual(goldenTx);
      });
    });

    describe('deploy', () => {
      const program = hexToBytes('736f6d6520636f6465');
      const sig =
        // eslint-disable-next-line max-len
        '34efe999c79ebfa4e97e91c992378b73f4b7598803321881a45c5ba19bab68a334f7eb100a10d831333da5ef614b15b85fd5a7ade95698c2bf7a530c94f14f0b';
      const txData: AthenaT<null> = {
        Version: 1n,
        Principal: Uint8Array.from(addresses[0]),
        TemplateAddress: undefined,
        Nonce: 222n,
        GasPrice: 1n,
        Payload: null,
        Signature: hexToBytes(sig),
      };
      const golden =
        '0400000000d9a50b405e64f3f8fc38dc82c6f3682ffc25c618007903044001e24cc3332824736f6d6520636f6465' +
        sig;

      it('encodes', () => {
        const txEncoded = Athena.enc({
          ...txData,
          Payload: [...DeployPayload.enc(program)],
        });
        expect(bytesToHex(txEncoded)).toEqual(golden);
      });
      it('decodes', () => {
        const txDecoded = Athena.dec(golden);
        expect(txDecoded).toEqual({
          ...txData,
          Payload: [...DeployPayload.enc(program)],
        });
      });
      it('Templates[].methods[deploy]()', () => {
        const codec =
          Templates[TEMPLATE_PUBKEY_HEX].methods[METHODS_HEX.DEPLOY];
        const txEncoded = codec.enc({
          ...txData,
          Payload: program,
        });
        expect(bytesToHex(txEncoded)).toEqual(golden);
      });
    });
  });
});