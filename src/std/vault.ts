import { Codec, CodecType, Struct } from 'scale-ts';
import { Compact32, Compact64 } from '../codecs/compact';
import { Address } from '../codecs/core';
import { SingleSig } from '../codecs/signatures';
import withTemplateAddress from '../codecs/withTemplateAddress';
import Transaction, { Payload } from '../transaction';
import { toBytes } from '../utils/hex';
import { TxPayload } from './common';

// Constants
export const VAULT_TEMPLATE_ADDRESS =
  '000000000000000000000000000000000000000000000004';

const byteAddress = toBytes(VAULT_TEMPLATE_ADDRESS);

// Codecs
const SpawnArguments = Struct({
  Owner: Address,
  TotalAmount: Compact64,
  InitialUnlockAmount: Compact64,
  VestingStart: Compact32,
  VestingEnd: Compact32,
});

const SpendArguments = Struct({
  Destination: Address,
  Amount: Compact64,
});

const SpawnPayload = TxPayload(SpawnArguments);
const SpendPayload = TxPayload(SpendArguments);

export type SpawnArguments = CodecType<typeof SpawnArguments>;

// Template
const newT = <T extends Payload, S>(n: number, pc: Codec<T>, sig: Codec<S>) =>
  new Transaction({
    address: byteAddress,
    methodSelector: n,
    spawnArgsCodec: SpawnArguments,
    payloadCodec: pc,
    sigCodec: sig,
  });

export const Methods = {
  Spawn: newT(0, withTemplateAddress(byteAddress, SpawnPayload), SingleSig),
  Spend: newT(16, SpendPayload, SingleSig),
};

const VaultTemplate = {
  key: VAULT_TEMPLATE_ADDRESS,
  publicKey: byteAddress,
  methods: {
    0: Methods.Spawn,
    16: Methods.Spend,
  },
} as const;

export default VaultTemplate;
