import { Struct } from 'scale-ts';
import { Compact32 } from '../codecs/compact';
import { Address, GasPrice, Nonce, PublicKey } from '../codecs/core';
import { SingleSig } from '../codecs/signatures';
import { asTemplate, Template } from '../template';
import { padAddress } from '../utils/padBytes';

// Constants
export const SINGLE_SIG_TEMPLATE_ADDRESS = padAddress([1]);

// Codecs
export const SpawnArguments = Struct({
  PublicKey,
});

export const SpawnPayload = Struct({
  TemplateAddress: Address,
  Arguments: SpawnArguments,
  GasPrice,
});

export const SpendArguments = Struct({
  Destination: Address,
  Amount: Compact32,
});

export const SpendPayload = Struct({
  Arguments: SpendArguments,
  Nonce,
  GasPrice,
});

// Template
export const SingleSigTemplate = asTemplate({
  publicKey: SINGLE_SIG_TEMPLATE_ADDRESS,
  methods: {
    0: [SpawnPayload, SingleSig],
    1: [SpendPayload, SingleSig],
  },
});

export default SingleSigTemplate;
