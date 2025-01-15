import { Codec, CodecType, Struct } from 'scale-ts';
import { Compact64 } from '../codecs/compact';
import { Address, PublicKey } from '../codecs/core';
import { SingleSig } from '../codecs/signatures';
import WithTemplateAddress from '../codecs/withTemplateAddress';
import Transaction, { Payload, TransactionData } from '../transaction';
import { toBytes } from '../utils/hex';
import { TxPayload } from './common';

// Constants
export const SINGLE_SIG_TEMPLATE_ADDRESS =
  '000000000000000000000000000000000000000000000001';

const byteAddress = toBytes(SINGLE_SIG_TEMPLATE_ADDRESS);

// Codecs
const SpawnArguments = Struct({
  PublicKey,
});

const SpendArguments = Struct({
  Destination: Address,
  Amount: Compact64,
});

export type SpawnArguments = CodecType<typeof SpawnArguments>;
export type SpendArguments = CodecType<typeof SpendArguments>;
export type SpawnPayload = CodecType<typeof SpawnPayload>;
export type SpendPayload = CodecType<typeof SpendPayload>;
export type SpawnTransaction = TransactionData<SpawnPayload>;
export type SpendTransaction = TransactionData<SpendPayload>;

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
  Spawn: newT(0, WithTemplateAddress(byteAddress, SpawnPayload), SingleSig),
  Spend: newT(16, SpendPayload, SingleSig),
};

const SingleSigTemplate = {
  key: SINGLE_SIG_TEMPLATE_ADDRESS,
  publicKey: byteAddress,
  methods: {
    0: Methods.Spawn,
    16: Methods.Spend,
  },
} as const;

export default SingleSigTemplate;
