import { Codec, CodecType, Struct, Vector } from 'scale-ts';
import { Compact64, Compact8 } from '../codecs/compact';
import { Address, PublicKey } from '../codecs/core';
import { MultiSig } from '../codecs/signatures';
import withTemplateAddress from '../codecs/withTemplateAddress';
import Transaction, { Payload } from '../transaction';
import { toBytes } from '../utils/hex';
import { TxPayload } from './common';

// Constants
export const MULTI_SIG_TEMPLATE_ADDRESS =
  '000000000000000000000000000000000000000000000002';

const byteAddress = toBytes(MULTI_SIG_TEMPLATE_ADDRESS);

// Codecs
const SpawnArguments = Struct({
  Required: Compact8,
  PublicKeys: Vector(PublicKey),
});

const SpendArguments = Struct({
  Destination: Address,
  Amount: Compact64,
});

export type SpawnArguments = CodecType<typeof SpawnArguments>;
export type SpendArguments = CodecType<typeof SpendArguments>;

const SpawnPayload = TxPayload(SpawnArguments);
const SpendPayload = TxPayload(SpendArguments);

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
  Spend: newT(16, SpendPayload, MultiSig),
};

const MultiSigTemplate = {
  key: MULTI_SIG_TEMPLATE_ADDRESS,
  publicKey: byteAddress,
  methods: {
    0: Methods.Spawn,
    16: Methods.Spend,
  },
} as const;

export default MultiSigTemplate;
