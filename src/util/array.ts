export function shuffle<T> (array: T[]) {
  // Durstenfeld shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export function pickRandom<T> (array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function repeat<T> (count: number, handler: (i: number) => T): T[] {
  return new Array(count).fill(0).map((_, i) => handler(i))
}
