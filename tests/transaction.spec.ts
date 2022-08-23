import { Struct } from 'scale-ts';
import { Compact32 } from '../src/codecs/compact';
import { Address, PublicKey } from '../src/codecs/core';
import { SingleSig } from '../src/codecs/signatures';
import Transaction, { TransactionData } from '../src/transaction';

const uint8range = (n: number) => Uint8Array.from([...Array(n).keys()]);

describe('Transaction', () => {
  const principal = 'sm1qqqqqqprmg4sq4ug5wjp4j0uu399xn9kkqasp6szdt6uh';
  const tplAddr = 'sm1qqqqqqqncn5ulxuhj7qzfdk928tv8a65sky0nags82gqh';
  const decodedPayload = {
    TemplateAddress: tplAddr,
    Arguments: uint8range(32),
  };
  const encodedTx = Uint8Array.from([
    0, 192, 115, 109, 49, 113, 113, 113, 113, 113, 113, 112, 114, 109, 103, 52,
    115, 113, 52, 117, 103, 53, 119, 106, 112, 52, 106, 48, 117, 117, 51, 57,
    57, 120, 110, 57, 107, 107, 113, 97, 115, 112, 54, 115, 122, 100, 116, 54,
    117, 104, 0, 192, 115, 109, 49, 113, 113, 113, 113, 113, 113, 113, 110, 99,
    110, 53, 117, 108, 120, 117, 104, 106, 55, 113, 122, 102, 100, 107, 57, 50,
    56, 116, 118, 56, 97, 54, 53, 115, 107, 121, 48, 110, 97, 103, 115, 56, 50,
    103, 113, 104, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ]);
  const decodedTx: TransactionData<typeof decodedPayload> = {
    TransactionType: 0n,
    Principal: principal,
    MethodSelector: 0n,
    Payload: decodedPayload,
  };
  //
  const tx = new Transaction({
    address: tplAddr,
    methodSelector: 0,
    payloadCodec: Struct({
      TemplateAddress: Address,
      Arguments: PublicKey,
    }),
    sigCodec: SingleSig,
  });

  describe('principal', () => {
    it('calculates principal address', async () => {
      const actual = await tx.principal('sm', {
        Arguments: decodedPayload.Arguments,
      });
      expect(actual).toEqual(principal);
    });
    it('throws an error if methodSelector != 0', async () => {
      const spendTx = new Transaction({
        address: tplAddr,
        methodSelector: 1,
        payloadCodec: Struct({
          Recipient: Address,
          Amount: Compact32,
        }),
        sigCodec: SingleSig,
      });
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
  it('encodes without signing', () => {
    const actual = tx.encode(principal, decodedPayload);
    expect(actual).toEqual(encodedTx);
  });
  it('decodes unsigned', () => {
    const actual = tx.decode(encodedTx);
    expect(actual).toEqual(decodedTx);
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
