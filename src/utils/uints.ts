export type IsPositive<N extends number> = `${N}` extends `-${string}`
  ? false
  : true;

export type IsInteger<N extends number> = `${N}` extends `${string}.${string}`
  ? never
  : `${N}` extends `-${string}.${string}`
    ? never
    : number;

export type IsUint<N extends number> =
  IsPositive<N> extends true
    ? IsInteger<N> extends number
      ? number
      : never
    : never;

///
///

export const UINT8_MAX_VALUE = 255;
export const UINT16_MAX_VALUE = 65535;
export const UINT32_MAX_VALUE = 4294967295;
export const UINT64_MAX_VALUE = 18446744073709551615n;

export type Uint8 = bigint;
export type Uint16 = bigint;
export type Uint32 = bigint;
export type Uint64 = bigint;

const getTypeByMaxValue = (maxValue: number | bigint) => {
  if (maxValue === UINT8_MAX_VALUE) {
    return 'U8';
  } else if (maxValue === UINT16_MAX_VALUE) {
    return 'U16';
  } else if (maxValue === UINT32_MAX_VALUE) {
    return 'U32';
  } else if (maxValue === UINT64_MAX_VALUE) {
    return 'U64';
  } else {
    throw new Error(`Unknown Uint type for max value of ${String(maxValue)}`);
  }
};

const U = <T extends number | bigint>(maxValue: T, value: T): bigint => {
  if (typeof value === 'number' && !Number.isInteger(value)) {
    const type = getTypeByMaxValue(maxValue);
    throw new Error(`${type} type does not support floats`);
  }
  const v = BigInt(value);
  if (v < 0 || v > maxValue) {
    const type = getTypeByMaxValue(maxValue);
    throw new Error(`Value ${String(v)} does not fit into ${type} type`);
  }
  return v;
};

export const U8 = (value: number | bigint): Uint8 => U(UINT8_MAX_VALUE, value);
export const U16 = (value: number | bigint): Uint16 =>
  U(UINT16_MAX_VALUE, value);
export const U32 = (value: number | bigint): Uint32 =>
  U(UINT32_MAX_VALUE, value);
export const U64 = (value: number | bigint): Uint64 =>
  U(UINT64_MAX_VALUE, value);

export type AnyUAssertion = typeof U8 | typeof U16 | typeof U32 | typeof U64;
