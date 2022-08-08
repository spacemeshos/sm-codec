export const concatBytes = (...bytes: Uint8Array[]): Uint8Array =>
  bytes.reduce(
    (acc, next) => new Uint8Array([...acc, ...next]),
    new Uint8Array([])
  );
