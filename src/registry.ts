import initBech32, { Bech32 } from '@spacemesh/address-wasm';
import SingleSigTemplates from './std/singlesig';
import { HRP } from './hrp';
import { Template } from './template';
import Transaction from './transaction';

class TemplateRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static templates = {
    ...Object.fromEntries(SingleSigTemplates.map((tpl) => [tpl.address, tpl])),
  };

  static bech32: null | Bech32;

  static init() {
    if (this.bech32) return Promise.resolve(this.bech32);
    // Does not matter what is the default, since
    // we will derive HRP from template address
    return initBech32(HRP.TestNet).then((b32) => {
      this.bech32 = b32;
      return this.bech32;
    });
  }

  static address(publicKey: Uint8Array, hrp?: HRP) {
    if (!this.bech32) {
      throw new Error('Bech32 is not instantiated');
    }
    return this.bech32.generateAddress(
      publicKey,
      hrp || this.bech32.getHRPNetwork()
    );
  }

  static register(template: Template) {
    this.templates[template.address] = template;
  }
  static get(address: string, methodSelector: number) {
    if (!this.bech32) {
      throw new Error('Bech32 is not instantiated');
    }
    if (!this.templates[address]) {
      throw new Error(
        `Codec for TemplateAddress ${address} & method ${methodSelector} not found`
      );
    }
    return new Transaction(
      {
        address,
        methodSelector,
        payloadCodec: this.templates[address].methods[methodSelector][0],
        sigCodec: this.templates[address].methods[methodSelector][1],
      },
      this.bech32
    );
  }
}

export default TemplateRegistry;
