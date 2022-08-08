import { Struct } from 'scale-ts';
import { Compact32 } from '../src/codecs/compact';
import { Address } from '../src/codecs/core';
import { SingleSig } from '../src/codecs/signatures';
import registerDefaultTemplates from '../src/defaults';
import { SINGLE_SIG_TEMPLATE_ADDRESS } from '../src/defaults/singlesig';
import TemplateRegistry from '../src/registry';
import { asTemplate } from '../src/template';
import Transaction from '../src/transaction';

describe('TemplateRegistry', () => {
  const tplAddr = 'some-address';
  const tpl = asTemplate({
    address: tplAddr,
    methods: {
      0: [Struct({ TemplateAddress: Address }), SingleSig],
      1: [Struct({ Recipient: Address, Amount: Compact32 }), SingleSig],
    },
  });

  it('registerDefaultTemplates() works', () => {
    registerDefaultTemplates();
    expect(TemplateRegistry.templates).toHaveProperty(
      SINGLE_SIG_TEMPLATE_ADDRESS
    );
  });
  it('register template', () => {
    TemplateRegistry.register(tpl);
    expect(TemplateRegistry.templates).toHaveProperty(tplAddr);
  });
  it('get: returns Transaction instance', () => {
    const tx = TemplateRegistry.get(tplAddr, 0);
    expect(tx).toBeInstanceOf(Transaction);
  });
});
