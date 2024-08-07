import SingleSigAccount from '../src/std/singlesig';
import { serializeBigInts } from './utils';

describe('SingleSigTemplate', () => {
  it('principal', () => {
    const pk = Uint8Array.from([
      104, 61, 219, 54, 160, 74, 208, 93, 115, 72, 5, 131, 19, 195, 246, 51,
      245, 186, 201, 233, 115, 202, 18, 253, 57, 147, 38, 196, 33, 66, 18, 250,
    ]);
    const tpl = SingleSigAccount.methods[0];
    const principal = tpl.principal({ PublicKey: pk });

    expect(principal).toEqual(
      Uint8Array.from([
        0, 0, 0, 0, 44, 61, 207, 69, 99, 61, 103, 140, 37, 201, 155, 147, 152,
        78, 110, 68, 25, 135, 9, 16,
      ])
    );
  });
  it('self-spawn', () => {
    const tpl = SingleSigAccount.methods[0];

    const raw = Uint8Array.from([
      0, 0, 0, 0, 0, 107, 14, 132, 231, 192, 227, 195, 127, 55, 8, 231, 230,
      122, 228, 173, 236, 117, 74, 243, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 106, 188, 184, 128, 131, 1,
      34, 6, 64, 212, 119, 57, 43, 116, 14, 72, 121, 233, 6, 195, 139, 49, 203,
      222, 112, 37, 155, 168, 219, 217, 124, 48, 191, 215, 82, 252, 243, 179,
      75, 236, 42, 142, 215, 73, 42, 156, 34, 149, 57, 37, 228, 143, 83, 103,
      28, 178, 91, 11, 204, 103, 186, 86, 138, 107, 184, 58, 156, 52, 95, 169,
      188, 118, 135, 34, 227, 216, 22, 232, 229, 101, 122, 170, 8, 87, 121, 209,
      106, 0, 204, 228, 107, 148, 13, 244, 172, 6,
    ]);
    const signature = Uint8Array.from([
      191, 215, 82, 252, 243, 179, 75, 236, 42, 142, 215, 73, 42, 156, 34, 149,
      57, 37, 228, 143, 83, 103, 28, 178, 91, 11, 204, 103, 186, 86, 138, 107,
      184, 58, 156, 52, 95, 169, 188, 118, 135, 34, 227, 216, 22, 232, 229, 101,
      122, 170, 8, 87, 121, 209, 106, 0, 204, 228, 107, 148, 13, 244, 172, 6,
    ]);

    const encodedByTpl = tpl.encode(
      Uint8Array.from([
        0, 0, 0, 0, 107, 14, 132, 231, 192, 227, 195, 127, 55, 8, 231, 230, 122,
        228, 173, 236, 117, 74, 243, 127,
      ]),
      {
        Nonce: 0n,
        GasPrice: 1n,
        Arguments: {
          PublicKey: Uint8Array.from([
            106, 188, 184, 128, 131, 1, 34, 6, 64, 212, 119, 57, 43, 116, 14,
            72, 121, 233, 6, 195, 139, 49, 203, 222, 112, 37, 155, 168, 219,
            217, 124, 48,
          ]),
        },
      }
    );
    const encodedAndSigned = tpl.sign(encodedByTpl, signature);
    const expected = tpl.decode(encodedAndSigned);
    const tx = tpl.decode(raw);
    expect(serializeBigInts(tx)).toEqual(serializeBigInts(expected));
  });
  it('spend', () => {
    const tpl = SingleSigAccount.methods[16];
    const principal = Uint8Array.from([
      0, 0, 0, 0, 107, 14, 132, 231, 192, 227, 195, 127, 55, 8, 231, 230, 122,
      228, 173, 236, 117, 74, 243, 127,
    ]);

    const payload = {
      Arguments: {
        Destination: principal,
        Amount: 120n,
      },
      Nonce: 1n,
      GasPrice: 1n,
    };
    const tx = tpl.encode(principal, payload);
    const expected = tpl.decode(tx);

    expect(principal).toEqual(principal);
    expect(serializeBigInts(payload)).toEqual(
      serializeBigInts(expected.Payload)
    );
  });
});
