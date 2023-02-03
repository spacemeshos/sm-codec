import { Struct } from 'scale-ts';
import { Address, PublicKey } from '../src/codecs/core';
import { SingleSig } from '../src/codecs/signatures';
import Transaction, { TransactionData } from '../src/transaction';

const uint8range = (n: number) => Uint8Array.from([...Array(n).keys()]);

describe('Transaction', () => {
  const principal = Uint8Array.from([
    0, 0, 0, 0, 207, 248, 188, 204, 216, 43, 110, 209, 114, 107, 203, 167, 123,
    218, 114, 246, 91, 197, 150, 30,
  ]);
  const tplAddr = Uint8Array.from([
    0, 0, 0, 0, 19, 196, 233, 207, 155, 151, 151, 128, 36, 182, 197, 81, 214,
    195, 247, 84, 133, 136, 249, 245,
  ]);
  const decodedPayload = {
    TemplateAddress: tplAddr,
    Arguments: uint8range(32),
  };
  const payloadCodec = Struct({
    TemplateAddress: Address,
    Arguments: PublicKey,
  });
  const encodedTx = Uint8Array.from([
    0, 0, 0, 0, 0, 207, 248, 188, 204, 216, 43, 110, 209, 114, 107, 203, 167,
    123, 218, 114, 246, 91, 197, 150, 30, 0, 0, 0, 0, 0, 19, 196, 233, 207, 155,
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

  const tx = new Transaction({
    address: tplAddr,
    methodSelector: 0,
    spawnArgsCodec: PublicKey,
    payloadCodec,
    sigCodec: SingleSig,
  });

  describe('principal', () => {
    it('calculates principal address', async () => {
      const actual0 = tx.principal(decodedPayload.Arguments);
      expect(actual0).toEqual(principal);
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
