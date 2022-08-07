import {
  AnyCompact,
  Compact16,
  Compact32,
  Compact64,
  Compact8,
} from '../src/types/compact';
import {
  UINT16_MAX_VALUE,
  UINT32_MAX_VALUE,
  UINT64_MAX_VALUE,
  UINT8_MAX_VALUE,
} from '../src/types/uints';

describe('Compact types', () => {
  // Represents a scale Compact Integers codec enhanced with assertion
  // to have a value in a certain range (e.g. fit Uint16)
  const testCase = (
    name: string,
    t: AnyCompact,
    testPairs: [bigint, number[]][],
    maxValue: number | bigint
  ) => {
    const mv = BigInt(maxValue);
    describe(name, () => {
      it('Encodes-Decodes', () => {
        const encodeDecodeCase = (v: bigint, expected: number[]) => {
          const encoded = t.enc(v);
          expect(encoded).toEqual(Uint8Array.from(expected));
          const decoded = t.dec(encoded);
          expect(v).toEqual(decoded);
        };
        testPairs.forEach(([input, outputBytes]) =>
          encodeDecodeCase(input, outputBytes)
        );
      });

      it('Throws an error on negative/fractional/overflow values', () => {
        expect(() => t.enc(-5n)).toThrow();
        expect(() => t.enc(10.5 as unknown as bigint)).toThrow();
        expect(() => t.enc(mv + 1n)).toThrow();

        expect(() =>
          t.dec(Uint8Array.from([255, 255, 255, 255, 255]))
        ).toThrow();
      });
    });
  };

  testCase(
    'Compact8',
    Compact8,
    [
      [0n, [0]],
      [100n, [145, 1]],
      [255n, [253, 3]],
    ],
    UINT8_MAX_VALUE
  );
  testCase(
    'Compact16',
    Compact16,
    [
      [0n, [0]],
      [100n, [145, 1]],
      [255n, [253, 3]],
      [65535n, [254, 255, 3, 0]],
    ],
    UINT16_MAX_VALUE
  );
  testCase(
    'Compact32',
    Compact32,
    [
      [0n, [0]],
      [100n, [145, 1]],
      [255n, [253, 3]],
      [65535n, [254, 255, 3, 0]],
      [4294967295n, [3, 255, 255, 255, 255]],
    ],
    UINT32_MAX_VALUE
  );
  testCase(
    'Compact64',
    Compact64,
    [
      [0n, [0]],
      [100n, [145, 1]],
      [255n, [253, 3]],
      [65535n, [254, 255, 3, 0]],
      [18446744073709551615n, [19, 255, 255, 255, 255, 255, 255, 255, 255]],
    ],
    UINT64_MAX_VALUE
  );
});
