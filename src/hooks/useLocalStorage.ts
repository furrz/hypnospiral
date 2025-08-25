import { useState, useEffect, useCallback } from 'react'

// Helper function to read from storage safely
function getStoredValue<T> (key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue
  }

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch (error) {
    console.error(error)
    return initialValue
  }
}

export function useLocalStorage<T> (key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStoredValue(key, initialValue)
  })

  // The setValue function now uses useCallback for optimization
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        // Dispatch a custom event to notify other components in the SAME tab
        window.dispatchEvent(new StorageEvent('storage', { key }))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  // This new useEffect is the key to synchronization
  useEffect(() => {
    // Handler to update state when storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(getStoredValue(key, initialValue))
      }
    }

    // Add event listener for 'storage' events
    window.addEventListener('storage', handleStorageChange)

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue]
}