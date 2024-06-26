## @spacemesh/sm-codec

TypeScript library provides easy way to encode, decode, and sign transactions.

See usage examples below:

```js
// Import
import { Stdtemplates, StdPublicKeys, StdMethods } from '@spacemesh/sm-codec';
import ed25519 from '@spacemesh/ed25519-wasm';

// SingleSig example
(async () => {
  // Get SingleSig template
  const singleSig = StdTemplates[StdPublicKeys.SingleSig];
  // Get method
  const spawnTpl = singleSig.methods[StdMethods.Spawn];

  // Prepare SpawnPayload
  const spawnPayload = {
    Arguments: {
      PublicKey: Uint8Array.from([/* your public key: 32 bytes */]),
    },
  };
  // Calculate Principal address (of your new account)
  const principal = spawnTpl.principal(spawnPayload);
  // Encode SpawnTransaction
  const rawTx = spawnTpl.encode(principal, spawnPayload);
  // Get transaction hash, it is used in signing
  const txHash = hash(rawTx);
  // Then use `ed25519` library to sign the hash with your private key
  const sig = ed25519.sign(myPrivateKey, txHash);
  // And finally sign tx (actualy it concatenates bytes)
  const signedTx = spawnTpl.sign(rawTx, sig);

  // Note: Principal method exists on any method
  // So this example will work as well:
  singleSig.methods[StdMethods.Spend].principal(spawnPayload);

})();
  ```

  Example of creating your own template:
  ```js
  import { PublicKey, SingleSig, Codecs } from '@spacemesh/sm-codec';
  import { Struct, str } from 'scale-ts';

  const spawnCodec = Struct({
    Owner: PublicKey,
  });
  const saySmthCodec = Struct({
    message: str,
  })

  // Address of the template in the network
  // 24 bytes length
  const address = Uint8Array.from([
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 100,
  ]);

  // Creating own templates
  const spawnTpl = new Transaction({
    address,
    methodSelector: 0,
    spawnArgsCodec: spawnCodec,
    // For Spawn transaction it is neccessary to add a template address into payload
    payloadCodec: withTemplateAddress(address, spawnCodec),
    sigCodec: SingleSig,
  });

  const saySmthTpl =
    new Transaction({
      address,
      methodSelector: 1,
      spawnArgsCodec: spawnCodec,
      payloadCodec: saySmthCodec,
      sigCodec: SingleSig,
    });
  
  // Use as in examples above
  const principal = saySmthTpl.principal({
    Owner: Uint8Array.from([ /* 32 bytes  */ ]),
  });

  const rawTx = saySmthTpl.encode(principal, {
    message: 'hello world',
  });

})();
```