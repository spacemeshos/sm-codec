export { default as Tx, Wrap } from './tx';
export type { AthenaTx as OpaqueTx, Athena as TypedTx } from './tx';
export { computePrincipal } from './principal';
export * as Wallet from './wallet';

import { Wrap } from './tx';
import * as Wallet from './wallet';
export type TemplatePubKeys = typeof Wallet.TEMPLATE_PUBKEY_HEX;

export const Templates = {
  [Wallet.TEMPLATE_PUBKEY_HEX]: {
    principal: Wallet.principal,
    methods: {
      [Wallet.METHODS_HEX.SPAWN]: Wrap(Wallet.SpawnPayload),
      [Wallet.METHODS_HEX.SPEND]: Wrap(Wallet.SpendPayload),
      [Wallet.METHODS_HEX.DEPLOY]: Wrap(Wallet.DeployPayload),
    },
  },
};
