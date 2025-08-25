
export function base64ToBytes (base64: string) {
  const binString = atob(base64)
  return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0)
}

export function bytesToBase64 (bytes: Uint8Array) {
  const binString = String.fromCodePoint(...bytes)
  return btoa(binString)
}
