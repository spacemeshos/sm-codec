import { Codec, CodecType, Struct, Vector } from 'scale-ts';
import { Compact64, Compact8 } from '../codecs/compact';
import { Address, PublicKey } from '../codecs/core';
import withTemplateAddress from '../codecs/withTemplateAddress';
import Transaction, { Payload } from '../transaction';
import { toBytes } from '../utils/hex';
import { TxPayload } from './common';
import { MultiSig } from '../codecs/signatures';

// Constants
export const VESTING_TEMPLATE_ADDRESS =
  '000000000000000000000000000000000000000000000004';

const byteAddress = toBytes(VESTING_TEMPLATE_ADDRESS);

// Codecs
const SpawnArguments = Struct({
  Required: Compact8,
  PublicKeys: Vector(PublicKey),
});

const DrainVaultArguments = Struct({
  Vault: Address,
  Destination: Address,
  Amount: Compact64,
});

const SpawnPayload = TxPayload(SpawnArguments);
const DrainPayload = TxPayload(DrainVaultArguments);

export type SpawnArguments = CodecType<typeof SpawnArguments>;
export type DrainArguments = CodecType<typeof DrainVaultArguments>;

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
  Spawn: newT(0, withTemplateAddress(byteAddress, SpawnPayload), MultiSig),
  Drain: newT(17, DrainPayload, MultiSig),
};

const VestingTemplate = {
  key: VESTING_TEMPLATE_ADDRESS,
  publicKey: byteAddress,
  methods: {
    0: Methods.Spawn,
    17: Methods.Drain,
  },
} as const;

export default VestingTemplate;
