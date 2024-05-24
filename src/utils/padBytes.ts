import { ADDRESS_BYTES_LENGTH } from '../codecs/constants';

export const padBytes =
  (maxLength: number) =>
  (bytes: Uint8Array | number[]): Uint8Array => {
    if (bytes.length === maxLength) return Uint8Array.from(bytes);
    const amount = maxLength > bytes.length ? maxLength - bytes.length : 0;
    return Uint8Array.from([
      ...Array.from(Array(amount).keys()).map(() => 0),
      ...Array.from(bytes),
    ]);
  };

export const padAddress = padBytes(ADDRESS_BYTES_LENGTH);
