import { Compact32 } from '../codecs/compact';
import { Address, GasPrice, Nonce, PublicKey, Struct } from '../codecs/core';
import { SingleSig } from '../codecs/signatures';
import { asTemplate } from '../template';

// Constants
export const SINGLE_SIG_TEMPLATE_TESTNET_ADDRESS =
  'stest1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgf0ae28';

export const SINGLE_SIG_TEMPLATE_ADDRESS =
  'sm1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg56ypy7';

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

// Templates
const tpl = (address: string) =>
  asTemplate({
    address,
    methods: {
      0: [SpawnPayload, SingleSig],
      1: [SpendPayload, SingleSig],
    },
  });

export const SingleSigTemplateTestnet = tpl(
  SINGLE_SIG_TEMPLATE_TESTNET_ADDRESS
);
export const SingleSigTemplateMainnet = tpl(SINGLE_SIG_TEMPLATE_ADDRESS);

export const SingleSigTemplates = [
  SingleSigTemplateTestnet,
  SingleSigTemplateMainnet,
];
export default SingleSigTemplates;
