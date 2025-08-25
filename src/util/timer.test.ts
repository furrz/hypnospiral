import { afterEach, describe, it, vi, expect, beforeEach } from 'vitest'
import { CancellableTimeout, debounce } from './timer'

describe('CancellableTimeout', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.restoreAllMocks())

  it('executes the timeout after the delay', () => {
    const cb = vi.fn()

    const ct = new CancellableTimeout()
    ct.schedule(cb, 2)

    vi.runAllTimers()

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('does not execute the timeout if cancelled', () => {
    const cb = vi.fn()

    const ct = new CancellableTimeout()
    ct.schedule(cb, 2)

    vi.advanceTimersByTime(1000)
    ct.cancel()
    vi.runAllTimers()

    expect(cb).not.toHaveBeenCalled()
  })

  it('cancels one timeout if provided another', () => {
    const cbA = vi.fn()
    const cbB = vi.fn()

    const ct = new CancellableTimeout()
    ct.schedule(cbA, 2)
    vi.advanceTimersByTime(1000)
    ct.schedule(cbB, 2)
    vi.runAllTimers()

    expect(cbA).not.toHaveBeenCalled()
    expect(cbB).toHaveBeenCalledTimes(1)
  })

  it('can be reused after executing', () => {
    const cbA = vi.fn()
    const cbB = vi.fn()

    const ct = new CancellableTimeout()
    ct.schedule(cbA, 2)
    vi.runAllTimers()
    ct.schedule(cbB, 2)
    vi.runAllTimers()

    expect(cbA).toHaveBeenCalledTimes(1)
    expect(cbB).toHaveBeenCalledTimes(1)
  })

  it('can be reused after cancelling', () => {
    const cbA = vi.fn()
    const cbB = vi.fn()

    const ct = new CancellableTimeout()
    ct.schedule(cbA, 2)
    vi.advanceTimersByTime(1000)
    ct.cancel()
    ct.schedule(cbB, 2)
    vi.runAllTimers()

    expect(cbA).not.toHaveBeenCalled()
    expect(cbB).toHaveBeenCalledTimes(1)
  })
})

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.restoreAllMocks())

  it('does not call the wrapped function immediately', () => {
    const cb = vi.fn()
    const wrapped = debounce(cb, 10)
    wrapped()
    expect(cb).not.toHaveBeenCalled()
  })

  it('calls the wrapped function after the timeout', () => {
    const cb = vi.fn()
    const wrapped = debounce(cb, 10)

    wrapped()
    vi.runAllTimers()
    expect(cb).toHaveBeenCalledOnce()
  })

  it('keeps delaying the call when it is repeated', () => {
    const cb = vi.fn()
    const wrapped = debounce(cb, 10)

    wrapped()
    vi.advanceTimersByTime(9)
    expect(cb).not.toHaveBeenCalled()

    wrapped()
    vi.advanceTimersByTime(5)
    expect(cb).not.toHaveBeenCalled()

    wrapped()
    vi.runAllTimers()
    expect(cb).toHaveBeenCalledOnce()
  })

  it('passes the most recently provided arguments once called', () => {
    const cb = vi.fn()
    const wrapped = debounce(cb, 10)

    wrapped(10)
    wrapped(20)
    vi.advanceTimersByTime(5)
    wrapped(30)
    vi.advanceTimersByTime(5)
    wrapped(40)
    vi.runAllTimers()

    expect(cb).toHaveBeenCalledOnce()
    expect(cb).toHaveBeenCalledWith(40)
  })

  it('can be called again after the timeout', () => {
    const cb = vi.fn()
    const wrapped = debounce(cb, 10)

    wrapped()
    vi.runAllTimers()
    expect(cb).toHaveBeenCalledOnce()

    wrapped()
    expect(cb).toHaveBeenCalledOnce()
    vi.runAllTimers()
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
