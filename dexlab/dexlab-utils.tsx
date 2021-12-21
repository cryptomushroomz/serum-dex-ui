import { useCallback, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export const DEXLAB_TELEGRAM = 'https://t.me/dexlab_official'
export const DEXLAB_TWITTER = 'https://twitter.com/Dexlab_official'
export const DEXLAB_DISCORD = 'https://discord.gg/XcQDV7z2Hz'

export function calCurrencyPrice(marketPrice: number, currencyPrice: number): number {
  if (currencyPrice > 0) {
    return marketPrice * currencyPrice
  }
  return marketPrice
}

export function numberWithCommasNormal(n) {
  try {
    if (!n || n === 0) {
      return 0
    }
    var parts = n.toString().split('.')
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '')
  } catch (e) {
    return n
  }
}

export function numberWithCommas(x, currency) {
  if (!x || x === 0) {
    return 0
  }

  if (currency.standardType === 'KRW') {
    return `${Number(x)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
  return x
}

export function get24hPricePercent({ orgPrice, newPrice }) {
  return ((newPrice - orgPrice) / orgPrice) * 100
}

export function isValidPublicKey(key) {
  if (!key) {
    return false
  }
  try {
    new PublicKey(key)
    return true
  } catch {
    return false
  }
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const percentFormat = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function floorToDecimal(value: number, decimals: number | undefined | null) {
  return decimals ? Math.floor(value * 10 ** decimals) / 10 ** decimals : Math.floor(value)
}

export function roundToDecimal(value: number, decimals: number | undefined | null) {
  return decimals ? Math.round(value * 10 ** decimals) / 10 ** decimals : value
}

export function getDecimalCount(value): number {
  if (!isNaN(value) && Math.floor(value) !== value && value.toString().includes('.'))
    return value.toString().split('.')[1].length || 0
  if (!isNaN(value) && Math.floor(value) !== value && value.toString().includes('e'))
    return parseInt(value.toString().split('e-')[1] || '0')
  return 0
}

export function divideBnToNumber(numerator: BN, denominator: BN): number {
  const quotient = Number(numerator.div(denominator))
  const rem = numerator.umod(denominator)
  const gcd = rem.gcd(denominator)
  return quotient + Number(rem.div(gcd)) / Number(denominator.div(gcd))
}

export function getTokenMultiplierFromDecimals(decimals: number): BN {
  return new BN(10).pow(new BN(decimals))
}

const localStorageListeners = {}

export function useLocalStorageStringState(
  key: string,
  defaultState: string | null = null,
): [string | null, (newState: string | null) => void] {
  const state = localStorage.getItem(key) || defaultState

  const [, notify] = useState(key + '\n' + state)

  useEffect(() => {
    if (!localStorageListeners[key]) {
      localStorageListeners[key] = []
    }
    localStorageListeners[key].push(notify)
    return () => {
      localStorageListeners[key] = localStorageListeners[key].filter((listener) => listener !== notify)
      if (localStorageListeners[key].length === 0) {
        delete localStorageListeners[key]
      }
    }
  }, [key])

  const setState = useCallback<(newState: string | null) => void>(
    (newState) => {
      const changed = state !== newState
      if (!changed) {
        return
      }

      if (newState === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, newState)
      }
      localStorageListeners[key].forEach((listener) => listener(key + '\n' + newState))
    },
    [state, key],
  )

  return [state, setState]
}

export function useLocalStorageState<T = any>(key: string, defaultState: T | null = null): [T, (newState: T) => void] {
  let [stringState, setStringState] = useLocalStorageStringState(key, JSON.stringify(defaultState))
  return [
    useMemo(() => stringState && JSON.parse(stringState), [stringState]),
    (newState) => setStringState(JSON.stringify(newState)),
  ]
}

export function useEffectAfterTimeout(effect, timeout) {
  useEffect(() => {
    const handle = setTimeout(effect, timeout)
    return () => clearTimeout(handle)
  })
}

export function useListener(emitter, eventName) {
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const listener = () => forceUpdate((i) => i + 1)
    emitter.on(eventName, listener)
    return () => emitter.removeListener(eventName, listener)
  }, [emitter, eventName])
}

export function abbreviateAddress(address: PublicKey, size = 4) {
  const base58 = address.toBase58()
  return base58.slice(0, size) + '…' + base58.slice(-size)
}

export function isEqual(obj1, obj2, keys) {
  if (!keys && Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  keys = keys || Object.keys(obj1)
  for (const k of keys) {
    if (obj1[k] !== obj2[k]) {
      // shallow comparison
      return false
    }
  }
  return true
}
