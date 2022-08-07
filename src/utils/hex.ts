// HexString represents a string with a sequence of hex character pairs.
// Can have a `0x` prefix:
// `0x0123456789abcdef`
// `0123456789abcdef`
export type HexString = string;

export const bytesToHex = (bytes: Uint8Array | number[]): HexString =>
  Array.from(bytes, (byte) =>
    ('0' + (byte & 0xff).toString(16)).slice(-2)
  ).join('');

export const hexToBytes = (hex: HexString) =>
  Uint8Array.from(
    hex
      .replace(/^0x/, '')
      .split(/(.{2})/)
      .filter(Boolean)
      .reduce((acc, next) => [...acc, parseInt(next, 16)], <number[]>[])
  );

export const isHexString = (str: unknown): str is HexString =>
  typeof str === 'string' && /^(0x)?([0-9a-f]{2})+$/i.test(str);
