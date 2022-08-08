import {
  AnyUAssertion,
  U16,
  U32,
  U64,
  U8,
  UINT16_MAX_VALUE,
  UINT32_MAX_VALUE,
  UINT64_MAX_VALUE,
  UINT8_MAX_VALUE,
} from '../src/utils/uints';

describe('Uint constructors', () => {
  const testCase = (
    name: string,
    u: AnyUAssertion,
    maxValue: number | bigint
  ) => {
    describe(name, () => {
      it('returns BigInt with valid value', () => {
        expect(u(0)).toEqual(0n);
        expect(u(BigInt(maxValue) / 2n)).toEqual(BigInt(maxValue) / 2n);
        expect(u(maxValue)).toEqual(BigInt(maxValue));

        expect(u(0n)).toEqual(0n);
        expect(u(BigInt(maxValue))).toEqual(BigInt(maxValue));
      });

      const overflowError = (val) =>
        `Value ${String(val)} does not fit into ${name} type`;
      const fractionalError = `${name} type does not support floats`;

      it('Throws an Error for negative values', () => {
        expect(() => u(-1)).toThrowError(overflowError(-1));
        expect(() => u(BigInt(maxValue) * -1n - 1n)).toThrowError(
          overflowError(BigInt(maxValue) * -1n - 1n)
        );
      });
      it('Throws an Error for fractional values', () => {
        expect(() => u(5.5)).toThrowError(fractionalError);
        expect(() => u(1000500.5)).toThrowError(fractionalError);
      });
      it('Throws an Error for overflow values', () => {
        expect(() => u(BigInt(maxValue) + 1n)).toThrowError(
          overflowError(BigInt(maxValue) + 1n)
        );
      });
    });
  };

  testCase('U8', U8, UINT8_MAX_VALUE);
  testCase('U16', U16, UINT16_MAX_VALUE);
  testCase('U32', U32, UINT32_MAX_VALUE);
  testCase('U64', U64, UINT64_MAX_VALUE);
});
