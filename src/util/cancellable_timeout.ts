export class CancellableTimeout {
  #timer: any

  schedule (handler: () => void, seconds: number) {
    this.#timer = setTimeout(handler, seconds * 1000)
  }

  cancel () {
    clearTimeout(this.#timer)
  }
}
