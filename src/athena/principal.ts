import hash from '../utils/hash';
import { padAddress } from '../utils/padBytes';

export const computePrincipal = (spawnArgBytes: Uint8Array): Uint8Array =>
  padAddress(hash(spawnArgBytes).slice(12));
