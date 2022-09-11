import { bytesToHex } from '../src/utils/hex';
import { padBytes } from '../src/utils/padBytes';

const u8 = (...bytes: number[]) => Uint8Array.from(bytes);

const noZeroes = (arr: Uint8Array) =>
  arr.reduce(
    (prev, next) => (next === 0 ? prev : [...prev, next]),
    <number[]>[]
  );

describe('padBytes', () => {
  const test = (len: number, val: number[]) => {
    it(`pads 0x${bytesToHex(val)} with zeroes up to ${len}`, () => {
      const pad = padBytes(len);
      const actual = pad(val);
      const expectedLength = Math.max(len, val.length);
      expect(actual).toHaveLength(expectedLength);
      expect(noZeroes(actual)).toEqual(noZeroes(u8(...val)));
    });
  };

  test(3, []);
  test(3, [1, 2]);
  test(3, [1, 2, 3, 4]);

  test(8, []);
  test(8, [0, 1]);
  test(8, [1, 2, 3, 4, 5, 6, 7, 8]);
  test(8, [240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250]);

  test(24, [1]);
});
