import { afterEach, describe, it, vi, expect, beforeEach } from 'vitest'
import { CancellableTimeout } from './cancellable_timeout'

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
