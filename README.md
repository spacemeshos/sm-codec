## @spacemesh/sm-codec

TypeScript library provides easy way to encode, decode, and sign transactions.

See usage examples below:

```js
// Import
import {
  TemplateRegistry,
  SINGLE_SIG_TEMPLATE_ADDRESS,
  SpawnPayload,
  hash,
} from '@spacemesh/sm-codec';
import ed25519 from '@spacemesh/ed25519-wasm';

(async () => {
  // Usage

  // TemplateRegistry has pre-registered templates.
  // You can also register your own templates. See below.

  // Single Sig account spawning
  const spawnSingleSig = TemplateRegistry.get(
    SINGLE_SIG_TEMPLATE_ADDRESS,
    0
  );
  // Prepare SpawnPayload
  const spawnPayload: SpawnPayload = {
    Arguments: {
      PublicKey: Uint8Array.from([/* your public key: 32 bytes */]),
    },
  };
  // Calculate Principal address (of your new account)
  const principal = spawnSingleSig.principal(spawnPayload);
  // Encode SpawnTransaction
  const rawTx = spawnSingleSig.encode(principal, spawnPayload);
  // Get transaction hash, it is used in signing
  const txHash = hash(rawTx);
  // Then use `ed25519` library to sign the hash with your private key
  const sig = ed25519.sign(myPrivateKey, txHash);
  // And finally sign tx (actualy it concatenates bytes)
  const signedTx = tpl.sign(rawTx, sig);
  ```

  Example of creating your own template:
  ```js
  import { TemplateRegistry, asTemplate, PublicKey, SingleSig } from '@spacemesh/sm-codec';
  import { Struct, str } from 'scale-ts';

  const spawnCodec = Struct({
    Owner: PublicKey,
    Nonce: str,
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
    0, 0, 0, 0, 0, 1,
  ]);

  // Creating own templates
  const myTemplate = asTemplate({
    publicKey,
    methods: {
      0: [spawnCodec, SingleSig],
      1: [saySmthCodec, SingleSig],
    },
  });

  // Add it to registry
  TemplateRegistry.register(address, myTemplate);

  // And then use it as described above
  const spawnMyAddr = TemplateRegistry.get(address, 0);

})();
```