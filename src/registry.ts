import { SingleSigTemplate } from './std/singlesig';
import { Template } from './template';
import Transaction from './transaction';
import { bytesToHex, HexString, toBytes, toHex } from './utils/hex';

class TemplateRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static templates: Record<HexString, Template> = {
    [SingleSigTemplate.key]: SingleSigTemplate,
  };

  static register(template: Template) {
    const pk = bytesToHex(template.publicKey);
    this.templates[pk] = template;
  }
  static get(address: string | Uint8Array, methodSelector: number) {
    const key = toHex(address);
    const publicKey = toBytes(address);
    if (!this.templates[key]) {
      throw new Error(
        `Codec for TemplateAddress ${key} & method ${methodSelector} not found`
      );
    }
    return new Transaction({
      address: publicKey,
      methodSelector,
      payloadCodec: this.templates[key].methods[methodSelector][0],
      sigCodec: this.templates[key].methods[methodSelector][1],
    });
  }

  static hasTemplate(address: string | Uint8Array) {
    const key = toHex(address);
    return !!this.templates[key];
  }

  static hasMethod(address: string | Uint8Array, methodSelector: number) {
    const key = toHex(address);
    return !!this.templates[key].methods[methodSelector];
  }
}

export default TemplateRegistry;
