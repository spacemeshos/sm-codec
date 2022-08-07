import path from 'path';
import { readFileSync } from 'fs';
import {
  SpawnArguments,
  SpawnPayload,
  SpendArguments,
  SpendPayload,
} from '../src/types/singlesig';
import { Codec } from 'scale-ts';
import { bytesToHex, hexToBytes, isHexString } from '../src/utils/hex';

type FixtureCase<T> = {
  Object: T;
  Hex: string;
};

function parseTypes(value: unknown) {
  if (isHexString(value)) return hexToBytes(value);
  else if (typeof value === 'number') return BigInt(value);
  else if (Array.isArray(value)) return Uint8Array.from(value);
  else if (typeof value === 'object' && !Array.isArray(value) && value !== null)
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, parseTypes(v)])
    );
  return value;
}

const fixture = (name: string) =>
  path.resolve(__dirname, './golden', `${name}.json`);

describe('Single-sig wallet codecs', () => {
  const runGoldenTest = <T>(testName: string, codec: Codec<T>) => {
    describe(testName, () => {
      const file = readFileSync(fixture(testName), 'utf-8');
      const json = JSON.parse(file);
      if (!(json instanceof Array)) {
        throw new Error(
          `Fixtures should contain a list of cases, but have: ${file}`
        );
      }
      for (const [index, obj] of json.entries()) {
        it(`Case ${index}`, () => {
          expect(obj).toHaveProperty('Object');
          expect(obj).toHaveProperty('Hex');
          expect(typeof obj.Hex).toBe('string');
          const fc: FixtureCase<T> = {
            Object: parseTypes(obj.Object),
            Hex: obj.Hex,
          };
          // Encode
          const encoded = codec.enc(fc.Object);
          expect(bytesToHex(encoded)).toEqual(fc.Hex);
          // Decode from fixture
          const decodedGold = codec.dec(fc.Hex);
          expect(decodedGold).toEqual(fc.Object);
          // Decode encoded
          const decoded = codec.dec(encoded);
          expect(decoded).toEqual(fc.Object);
        });
      }
    });
  };

  runGoldenTest('SpawnArguments', SpawnArguments);
  runGoldenTest('SpawnPayload', SpawnPayload);
  runGoldenTest('SpendArguments', SpendArguments);
  runGoldenTest('SpendPayload', SpendPayload);
});
