import { Codec } from 'scale-ts';
import { MultiSig, SingleSig } from './codecs/signatures';
import { bytesToHex, HexString } from './utils/hex';
export interface Template {
  key: HexString; // hex representation of publicKey
  publicKey: Uint8Array;
  methods: Record<
    number,
    [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Codec<any>,
      Codec<SingleSig> | Codec<MultiSig>
    ]
  >; //TemplateMethodsMap<T>;
}

export type TemplateArgument = Omit<Template, 'key'> | Template;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTemplate = (t: any): t is Template =>
  t.key &&
  t.publicKey &&
  t.methods &&
  t.methods[0] &&
  t.methods[0][0] &&
  t.methods[0][1];

export const asTemplate = (t: TemplateArgument): Template => {
  let res = t;
  if (!isTemplate(t))
    res = {
      ...t,
      key: bytesToHex(t.publicKey),
    };
  if (!isTemplate(res)) {
    throw new Error(`Wrong template: ${t}`);
  }
  return res;
};
