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
