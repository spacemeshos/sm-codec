import { Codec, CodecType, Struct } from 'scale-ts';
import { Compact64 } from '../codecs/compact';
import { Address, GasPrice, Nonce, PublicKey } from '../codecs/core';
import { SingleSig } from '../codecs/signatures';
import withTemplateAddress from '../codecs/withTemplateAddress';
import Transaction, { Payload, TransactionData } from '../transaction';
import { bytesToHex } from '../utils/hex';
import { padAddress } from '../utils/padBytes';

// Constants
export const SINGLE_SIG_TEMPLATE_ADDRESS = padAddress([1]);

// Codecs
const SpawnArguments = Struct({
  PublicKey,
});

const SpawnPayload = Struct({
  Nonce,
  GasPrice,
  Arguments: SpawnArguments,
});

const SpendArguments = Struct({
  Destination: Address,
  Amount: Compact64,
});

const SpendPayload = Struct({
  Nonce,
  GasPrice,
  Arguments: SpendArguments,
});

export type SpawnPayload = CodecType<typeof SpawnPayload>;
export type SpendPayload = CodecType<typeof SpendPayload>;

export type SpawnTransaction = TransactionData<SpawnPayload>;
export type SpendTransaction = TransactionData<SpendPayload>;

// Template
const newT = <T extends Payload, S>(n: number, pc: Codec<T>, sig: Codec<S>) =>
  new Transaction({
    address: SINGLE_SIG_TEMPLATE_ADDRESS,
    methodSelector: n,
    spawnArgsCodec: SpawnArguments,
    payloadCodec: pc,
    sigCodec: sig,
  });

export const Methods = {
  Spawn: newT(
    0,
    withTemplateAddress(SINGLE_SIG_TEMPLATE_ADDRESS, SpawnPayload),
    SingleSig
  ),
  Spend: newT(16, SpendPayload, SingleSig),
};

const SingleSigTemplate = {
  key: bytesToHex(SINGLE_SIG_TEMPLATE_ADDRESS),
  publicKey: SINGLE_SIG_TEMPLATE_ADDRESS,
  methods: {
    0: Methods.Spawn,
    16: Methods.Spend,
  } as const,
};

export default SingleSigTemplate;
