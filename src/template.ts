import { Codec } from 'scale-ts';
import { MultiSig, SingleSig } from './codecs/signatures';
export interface Template {
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: Record<number, [Codec<any>, Codec<SingleSig> | Codec<MultiSig>]>; //TemplateMethodsMap<T>;
}

export const asTemplate = (t: Template): Template => t;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTemplate = (t: any): t is Template =>
  t.address && t.methods && t.methods[0] && t.methods[0][0] && t.methods[0][1];
