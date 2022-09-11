import { Codec, CodecType, Struct } from 'scale-ts';
import { Compact32 } from '../src/codecs/compact';
import { Address } from '../src/codecs/core';
import { SingleSig } from '../src/codecs/signatures';
import SingleSigTemplate, {
  SINGLE_SIG_TEMPLATE_ADDRESS,
  SpawnPayload,
} from '../src/std/singlesig';
import TemplateRegistry from '../src/registry';
import { asTemplate } from '../src/template';
import Transaction from '../src/transaction';
import Bech32 from '@spacemesh/address-wasm';
import { padAddress } from '../src/utils/padBytes';

describe('TemplateRegistry', () => {
  const tplAddr = padAddress([101]);
  const tpl = asTemplate({
    publicKey: tplAddr,
    methods: {
      0: [Struct({ TemplateAddress: Address }), SingleSig],
      1: [Struct({ Recipient: Address, Amount: Compact32 }), SingleSig],
    },
  });

  it('standard templates are accessible by default', () => {
    expect(TemplateRegistry.templates).toHaveProperty(SingleSigTemplate.key);
  });
  it('register()', () => {
    TemplateRegistry.register(tpl);
    expect(TemplateRegistry.templates).toHaveProperty(tpl.key);
    const tx = TemplateRegistry.get(tplAddr, 0);
    expect(tx).toBeInstanceOf(Transaction);
  });
  it('golden', () => {
    const raw = Uint8Array.from([
      0, 0, 0, 0, 0, 107, 14, 132, 231, 192, 227, 195, 127, 55, 8, 231, 230,
      122, 228, 173, 236, 117, 74, 243, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 106, 188, 184, 128, 131, 1, 34, 6,
      64, 212, 119, 57, 43, 116, 14, 72, 121, 233, 6, 195, 139, 49, 203, 222,
      112, 37, 155, 168, 219, 217, 124, 48, 4, 191, 215, 82, 252, 243, 179, 75,
      236, 42, 142, 215, 73, 42, 156, 34, 149, 57, 37, 228, 143, 83, 103, 28,
      178, 91, 11, 204, 103, 186, 86, 138, 107, 184, 58, 156, 52, 95, 169, 188,
      118, 135, 34, 227, 216, 22, 232, 229, 101, 122, 170, 8, 87, 121, 209, 106,
      0, 204, 228, 107, 148, 13, 244, 172, 6,
    ]);
    const tpl = TemplateRegistry.get(
      SINGLE_SIG_TEMPLATE_ADDRESS,
      0
    ) as Transaction<CodecType<typeof SpawnPayload>, Codec<SingleSig>>;
    const tx = tpl.decode(raw);

    const encodedByTpl = tpl.encode(
      Uint8Array.from([
        0, 0, 0, 0, 107, 14, 132, 231, 192, 227, 195, 127, 55, 8, 231, 230, 122,
        228, 173, 236, 117, 74, 243, 127,
      ]),
      {
        TemplateAddress: SINGLE_SIG_TEMPLATE_ADDRESS,
        Arguments: {
          PublicKey: Uint8Array.from([
            106, 188, 184, 128, 131, 1, 34, 6, 64, 212, 119, 57, 43, 116, 14,
            72, 121, 233, 6, 195, 139, 49, 203, 222, 112, 37, 155, 168, 219,
            217, 124, 48,
          ]),
        },
        GasPrice: 1n,
      }
    );
    const encodedAndSigned = tpl.sign(
      encodedByTpl,
      Uint8Array.from(Array.from(raw).slice(-64))
    );
    const expected = tpl.decode(encodedAndSigned);

    expect(tx).toEqual(expected);
  });
});
