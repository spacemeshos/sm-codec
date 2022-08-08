import { Bytes, CodecType } from 'scale-ts';

export const Hash24 = Bytes(24);
export type Hash24 = CodecType<typeof Hash24>;

// Hash32 represents the 32-byte sha256 hash of arbitrary data.
export const Hash32 = Bytes(32);
export type Hash32 = CodecType<typeof Hash32>;
