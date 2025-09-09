let wakeLock: WakeLockSentinel | null = null

function getWakeLock () {
  navigator.wakeLock?.request('screen')
    .then(result => {
      wakeLock = result
    })
    .catch(_ => {})
}

getWakeLock()

document.addEventListener('visibilitychange', _ => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    getWakeLock()
  }
})
