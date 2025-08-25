
export async function readStream (stream: ReadableStream) {
  const reader = stream.getReader()

  let state = new Uint8Array()

  do {
    const { done, value } = await reader.read() as ReadableStreamReadResult<Uint8Array>
    if (done) return state

    const newValue = new Uint8Array(value.length + state.length)
    newValue.set(state, 0)
    newValue.set(value, state.length)
    state = newValue
  } while (true)
}
