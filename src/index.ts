export { default as hash } from './utils/hash';
export { padBytes, padAddress } from './utils/padBytes';

export * as Codecs from './codecs';
export { default as TemplateRegistry } from './registry';

export * from './std';
export type {
  TemeplateArgumentsMap,
  SpawnTransaction,
  SpendTransaction,
} from './std';

export { default as SingleSigTemplate } from './std/singlesig';
export { default as MultiSigTemplate } from './std/multisig';
export { default as VaultTemplate } from './std/vault';
export { default as VestingTemplate } from './std/vesting';
