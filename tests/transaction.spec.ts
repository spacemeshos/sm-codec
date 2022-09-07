import initBech32, { Bech32 } from '@spacemesh/address-wasm';
import { Compact32 } from '../src/codecs/compact';
import { Address, PublicKey, Struct } from '../src/codecs/core';
import { SingleSig } from '../src/codecs/signatures';
import Transaction, { TransactionData } from '../src/transaction';

const uint8range = (n: number) => Uint8Array.from([...Array(n).keys()]);

describe('Transaction', () => {
  const principal = 'sm1qqqqqqzhdpalehrzuzuf8ukptfse96y20m0ke6gxl4kwa';
  const tplAddr = 'sm1qqqqqqqncn5ulxuhj7qzfdk928tv8a65sky0nags82gqh';
  const decodedPayload = {
    TemplateAddress: tplAddr,
    Arguments: uint8range(32),
  };
  const payloadCodec = Struct({
    TemplateAddress: Address,
    Arguments: PublicKey,
  });
  const txOptions = {
    address: tplAddr,
    methodSelector: 0,
    payloadCodec,
    sigCodec: SingleSig,
  };
  const encodedTx = Uint8Array.from([
    0, 0, 0, 0, 0, 87, 104, 123, 252, 220, 98, 224, 184, 147, 242, 193, 90, 97,
    146, 232, 138, 126, 223, 108, 233, 0, 0, 0, 0, 0, 19, 196, 233, 207, 155,
    151, 151, 128, 36, 182, 197, 81, 214, 195, 247, 84, 133, 136, 249, 245, 0,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ]);
  const decodedTx: TransactionData<typeof decodedPayload> = {
    TransactionType: 0n,
    Principal: principal,
    MethodSelector: 0n,
    Payload: decodedPayload,
  };

  let tx: Transaction<typeof decodedPayload, typeof SingleSig>;
  let bech32: Bech32;
  beforeAll(async () => {
    bech32 = await initBech32('sm');
    tx = new Transaction(txOptions, bech32);
  });

  describe('principal', () => {
    it('calculates principal address', async () => {
      const actual = tx.principal('sm', {
        Arguments: decodedPayload.Arguments,
      });
      expect(actual).toEqual(principal);
    });
    it('throws an error if methodSelector != 0', async () => {
      const spendTx = new Transaction(
        {
          address: tplAddr,
          methodSelector: 1,
          payloadCodec: Struct({
            Recipient: Address,
            Amount: Compact32,
          }),
          sigCodec: SingleSig,
        },
        bech32
      );
      const t = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — used here just to ensure that in JS-world it
        //              will throw an error
        return spendTx.principal('sm', {
          Recipient: principal,
          Amount: 100n,
        });
      };
      expect(t).toThrowError();
    });
  });
  it('encodes/decodes without signing', () => {
    const encoded = tx.encode(principal, decodedPayload);
    const decoded = tx.decode(encoded);
    expect(encoded).toEqual(encodedTx);
    expect(decoded).toEqual(decodedTx);
  });
  it('signs tx', () => {
    const sign = uint8range(64);
    const actual = tx.sign(encodedTx, sign);
    expect(actual).toEqual(Uint8Array.from([...encodedTx, ...sign]));
  });
  it('decodes signed', () => {
    const sign = uint8range(64);
    const encodedAndSignedTx = tx.sign(encodedTx, sign);
    const actual = tx.decode(encodedAndSignedTx);
    expect(actual).toEqual({ ...decodedTx, signature: sign });
  });
});
