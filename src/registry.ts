import { StdTemplates } from './std';
import { Template } from './template';
import { bytesToHex, toHex } from './utils/hex';

type DeepWriteable<T> = {
  -readonly [P in keyof T]: T[P] extends readonly []
    ? DeepWriteable<T[P]>
    : T[P];
};

type RTemplates = typeof TemplateRegistry.templates;
type RTemplate<A> = A extends keyof RTemplates ? RTemplates[A] : never;
type RMethods<A> = RTemplate<A>['methods'];
type RMethodselectors<A> = keyof RMethods<A>;
// type RMethod<A, MS> = MS extends RMethodselectors<A> ? RMethods<A>[MS] : never;

class TemplateRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static templates: typeof StdTemplates | { [key: string]: Template } = {
    ...StdTemplates,
  };

  static register(template: Template) {
    const pk = bytesToHex(template.publicKey);
    this.templates[pk] = template;
  }
  static get<A extends keyof RTemplates, MS extends RMethodselectors<A>>(
    address: A | Uint8Array,
    methodSelector: MS
  ) {
    const key = address instanceof Uint8Array ? (toHex(address) as A) : address;
    if (!this.templates[key]) {
      throw new Error(
        `Codec for TemplateAddress ${address} & method ${String(
          methodSelector
        )} not found`
      );
    }
    if (typeof methodSelector === 'symbol') {
      throw new Error(
        `Method selector should be a number type, got ${String(methodSelector)}`
      );
    }
    const methods = this.templates[key].methods as DeepWriteable<RMethods<A>>;
    return methods[methodSelector];
  }

  static hasTemplate(address: string | Uint8Array) {
    const key = toHex(address);
    return !!this.templates[key];
  }

  static hasMethod<
    A extends string,
    MS extends keyof typeof TemplateRegistry.templates[A]['methods']
  >(address: A, methodSelector: MS) {
    const key = toHex(address);
    return !!this.templates[key].methods[methodSelector];
  }
}

export default TemplateRegistry;
