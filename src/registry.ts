import { StdTemplates } from './std';
import { toHex } from './utils/hex';

type DeepWriteable<T> = {
  -readonly [P in keyof T]: T[P] extends readonly []
    ? DeepWriteable<T[P]>
    : T[P];
};

type RTemplates = typeof TemplateRegistry.templates;
type RTemplate<A> = A extends keyof RTemplates ? RTemplates[A] : never;
type RMethods<A> = RTemplate<A>['methods'];
type RMethodselectors<A> = keyof RMethods<A>;

// Deprecated
// Keeping it for a backward-compatibility
class TemplateRegistry {
  static templates = {
    ...StdTemplates,
  };

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
}

export default TemplateRegistry;
