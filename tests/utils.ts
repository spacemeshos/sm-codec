export const serializeBigInts = (x) =>
  Object.fromEntries(
    Object.entries(x).map(([k, v]) => [
      k,
      typeof v === 'bigint'
        ? v.toString()
        : typeof v === 'object' &&
            !(v instanceof Array || v instanceof Uint8Array)
          ? serializeBigInts(v)
          : v,
    ])
  );
