/// Generate random bytes for fuzzing
export function genRandomBytes () {
  const randByteCount = Math.floor(Math.random() * 128) + 2
  const genRandomByte = () => Math.floor(Math.random() * 256)
  return new Uint8Array(new Array(randByteCount).fill(0).map(genRandomByte))
}
