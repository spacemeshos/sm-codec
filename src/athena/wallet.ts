import { CodecType, Struct, u64 } from 'scale-ts';
import { Address, PublicKey } from '../codecs';
import { computePrincipal, PrincipalCodec } from './principal';
import WithMethodSelector from './withMethodSelector';
import { toBytes } from '../utils/hex';

export const TEMPLATE_PUBKEY_HEX =
  '000000000000000000000000000000000000000000000001';
export const TEMPLATE_PUBKEY = toBytes(TEMPLATE_PUBKEY_HEX);

export const METHODS = {
  SPAWN: Uint8Array.from([3, 245, 63, 32]),
  SPEND: Uint8Array.from([251, 23, 132, 48]),
};

export const METHODS_HEX = {
  SPAWN: '03f53f20',
  SPEND: 'fb178430',
} as const;

export const PrincipalSpawnArgs = PrincipalCodec(PublicKey);

export type PrincipalSpawnArgs = CodecType<typeof PrincipalSpawnArgs>;

export const principal = (spawnArgs: PrincipalSpawnArgs) =>
  computePrincipal(TEMPLATE_PUBKEY, PrincipalSpawnArgs.enc(spawnArgs));

const SpawnArguments = Struct({
  PubKey: PublicKey,
});

export type SpawnArguments = CodecType<typeof SpawnArguments>;

export const SpawnPayload = WithMethodSelector(METHODS.SPAWN, SpawnArguments);

const SpendArguments = Struct({
  Recipient: Address,
  Amount: u64,
});

export type SpendArguments = CodecType<typeof SpendArguments>;

export const SpendPayload = WithMethodSelector(METHODS.SPEND, SpendArguments);
