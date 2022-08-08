import SingleSigTemplate from './defaults/singlesig';
import { Template } from './template';
import Transaction from './transaction';

class TemplateRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static templates = {
    [SingleSigTemplate.address]: SingleSigTemplate,
  };

  static register(template: Template) {
    this.templates[template.address] = template;
  }
  static get(address: string, methodSelector: number) {
    if (!this.templates[address]) {
      throw new Error(
        `Codec for TemplateAddress ${address} & method ${methodSelector} not found`
      );
    }
    return new Transaction({
      address,
      methodSelector,
      payloadCodec: this.templates[address].methods[methodSelector][0],
      sigCodec: this.templates[address].methods[methodSelector][1],
    });
  }
}

export default TemplateRegistry;
