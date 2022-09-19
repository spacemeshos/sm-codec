import Transaction from './transaction';
import { HexString } from './utils/hex';
export interface Template {
  key: HexString; // hex representation of publicKey
  publicKey: Uint8Array;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: Record<number, Transaction<any, any, any>>;
}

export type TemplateArgument = Omit<Template, 'key'> | Template;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTemplate = (t: any): t is Template =>
  t.key && t.publicKey && t.methods && t.methods[0] && t.methods[1];
