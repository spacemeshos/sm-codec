import { blake3 } from '@noble/hashes/blake3';
import { Input } from '@noble/hashes/utils';

const hash = (input: Input) => blake3(input);

export default hash;
