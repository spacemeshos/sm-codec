import MultiSigTemplate, {
  SpawnArguments as MultiSigSpawnArguments,
} from './multisig';
import SingleSigTemplate, {
  SpawnArguments as SingleSigSpawnArguments,
  SpendArguments,
} from './singlesig';
import VaultTemplate, { SpawnArguments as VaultSpawnArguments } from './vault';
import VestingTemplate, {
  SpawnArguments as VestingSpawnArguments,
  DrainArguments,
} from './vesting';

export type {
  SpawnArguments as SingleSigSpawnArguments,
  SpendArguments,
  SpawnTransaction,
  SpendTransaction,
} from './singlesig';
export type { SpawnArguments as MultiSigSpawnArguments } from './multisig';
export type { SpawnArguments as VaultSpawnArguments } from './vault';
export type {
  SpawnArguments as VestingSpawnArguments,
  DrainArguments,
} from './vesting';

export const StdTemplates = {
  [SingleSigTemplate.key]: SingleSigTemplate,
  [MultiSigTemplate.key]: MultiSigTemplate,
  [VaultTemplate.key]: VaultTemplate,
  [VestingTemplate.key]: VestingTemplate,
};

export const StdPublicKeys = {
  SingleSig: SingleSigTemplate.key,
  MultiSig: MultiSigTemplate.key,
  Vault: VaultTemplate.key,
  Vesting: VestingTemplate.key,
};

export const StdMethods = {
  Spawn: 0,
  Spend: 16,
  Drain: 17,
} as const;

export type StdTemplateKeys = keyof typeof StdTemplates;

export type StdMethodSelectors = keyof typeof StdMethods;

export type TemeplateArgumentsMap = {
  [SingleSigTemplate.key]: {
    [StdMethods.Spawn]: SingleSigSpawnArguments;
    [StdMethods.Spend]: SpendArguments;
  };
  [MultiSigTemplate.key]: {
    [StdMethods.Spawn]: MultiSigSpawnArguments;
    [StdMethods.Spend]: SpendArguments;
  };
  [VaultTemplate.key]: {
    [StdMethods.Spawn]: VaultSpawnArguments;
  };
  [VestingTemplate.key]: {
    [StdMethods.Spawn]: VestingSpawnArguments;
    [StdMethods.Drain]: DrainArguments;
  };
};
