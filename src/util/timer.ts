export class CancellableTimeout {
  #timer: any = null

  schedule (handler: () => void, seconds: number) {
    if (this.#timer !== null) {
      clearTimeout(this.#timer)
    }

    this.#timer = setTimeout(() => {
      this.#timer = null
      handler()
    }, seconds * 1000)
  }

  cancel () {
    clearTimeout(this.#timer)
    this.#timer = null
  }
}

/// Wraps a function to ensure it can't be called multiple times within `timeout` milliseconds.
export function debounce<Args extends any[]> (func: (...args: Args) => void | Promise<void>, timeout = 100) {
  let timer: any
  return (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
