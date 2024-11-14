import { Codec, Struct, u64 } from 'scale-ts';
import hash from '../utils/hash';
import { padAddress } from '../utils/padBytes';

export const PrincipalCodec = <T>(SpawnPayload: Codec<T>) =>
  Struct({
    Nonce: u64,
    Balance: u64,
    Payload: SpawnPayload,
  });

export const computePrincipal = (
  templateAddress: Uint8Array,
  spawnArgBytes: Uint8Array
): Uint8Array =>
  padAddress(
    hash(Uint8Array.from([...templateAddress, ...spawnArgBytes])).slice(12)
  );
