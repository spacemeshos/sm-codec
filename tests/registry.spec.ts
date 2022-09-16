import { Struct } from 'scale-ts';
import { Compact32 } from '../src/codecs/compact';
import { Address, PublicKey } from '../src/codecs/core';
import { SingleSig } from '../src/codecs/signatures';
import SingleSigTemplate from '../src/std/singlesig';
import TemplateRegistry from '../src/registry';
import Transaction from '../src/transaction';
import { padAddress } from '../src/utils/padBytes';
import { bytesToHex } from '../src/utils/hex';

describe('TemplateRegistry', () => {
  const tplAddr = padAddress([101]);
  const tpl = {
    key: bytesToHex(tplAddr),
    publicKey: tplAddr,
    methods: {
      0: new Transaction({
        address: tplAddr,
        methodSelector: 0,
        spawnArgsCodec: PublicKey,
        payloadCodec: Struct({ TemplateAddress: Address }),
        sigCodec: SingleSig,
      }),
      1: new Transaction({
        address: tplAddr,
        methodSelector: 0,
        spawnArgsCodec: PublicKey,
        payloadCodec: Struct({
          Recipient: Address,
          Amount: Compact32,
        }),
        sigCodec: SingleSig,
      }),
    },
  };

  it('standard templates are accessible by default', () => {
    expect(TemplateRegistry.templates).toHaveProperty(SingleSigTemplate.key);
  });
  it('register()', () => {
    TemplateRegistry.register(tpl);
    expect(TemplateRegistry.templates).toHaveProperty(tpl.key);
    const tx = TemplateRegistry.get(tpl.key, 0);
    expect(tx).toBeInstanceOf(Transaction);
  });
});
