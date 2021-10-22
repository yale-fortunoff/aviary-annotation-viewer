/* eslint-disable no-bitwise */
// borrwing implementation from https://stackoverflow.com/a/7616484
// non-secure hashing function, using only to convert URIs into
// more compact hash values

export default async function insecureStringHash(
  input: string
): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  return crypto.subtle.digest('SHA-256', bytes).then((result) => {
    const ints = new Uint8Array(result);
    const arr = Array.from(ints);
    const chars = arr.map((b) => b.toString(16));
    return chars.join('');
  });
}
