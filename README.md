```js
// Usage

//
const tpl = TemplateRegistry.get(addr, 2);
const rawTx = tpl.encode({
  arg0: 1,
  arg1: 2,
  arg2: 'hello, world',
});
const signedTx = tpl.sign(rawTx, pk0);

//
const multisig = TemplateRegistry.get(addr_mult, 0);
const rawTx = multisig.encode({
  publicKeys: [
    pk0,
    pk1,
    pk2,
  ]
});
const signedTx = multisig.sign(rawTx, [sig0, sig2]);

// Creating
const templateSingleSig = new Template({
  address: 'sm1qqqqa2f142...123',
  methods: {
    0: [SpawnPayloadCodec, SingleSig],
    1: [SpendPayloadCodec, SingleSig],
  },
});
TemplateRegistry.register(addr, templateSingleSig);

//
```