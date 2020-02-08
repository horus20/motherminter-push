import * as cryptoRandomString from 'crypto-random-string'
import axios from 'axios'
import { SHA256 } from 'crypto-js'
import { walletFromPrivateKey } from 'minterjs-wallet'
import { Decimal } from 'decimal.js'

export const BACKEND_BASE_URL = 'https://p.motherminter.org'
//export const BACKEND_BASE_URL = 'http://localhost:3048'
export const EXPLORER_BASE_URL = 'https://explorer-api.minter.network'
export const EXPLORER_GATE_API_URL = 'https://gate-api.minter.network'
export const LINK = 'https://p.motherminter.org/'
export const COURCE_BIP_URL = 'https://api.bip.dev/api/price'
export const COURCE_FIAT_URL = 'https://www.cbr-xml-daily.ru/daily_json.js'
export const DEFAULT_SYMBOL = 'BIP'
export const ACTIVATE_FEE = '0.1'    // todo: change this place
export const PUSH_WALLET_ID_LENGTH = 6

/**
 * get sha256 hash from string
 * @return {string}
 */
export function getHash (string) {
  return SHA256(string).toString()
}

/**
 * Generate UID
 * @param length - result uid length
 * @return {string}
 */
export function generateWalletUid (length = PUSH_WALLET_ID_LENGTH) {
  return cryptoRandomString({
    length,
    type: 'url-safe',
  })
}

/**
 * Create company -> call server api method
 * @param params
 * @return {Promise<Company>}
 */
export async function createCompany (params = {}) {
  const response = await axios.post(`${BACKEND_BASE_URL}/api/company`, params)

  return response.data
}

/**
 * Create wallet pair (privateKey, mxAddress) with pbkdf2 algo
 * @param uid
 * @param password
 * @return {Promise<{privateKey: string, address: string}>}
 */
export async function createWallet (uid, password = '') {
  const privateKey = SHA256(`${uid}${password}`).toString()
  const privateKeyBuffer = Buffer.from(privateKey, 'hex')
  const wallet = walletFromPrivateKey(privateKeyBuffer)

  return {
    privateKey,
    address: wallet.getAddressString(),
  }
}

/**
 * Get address balances info
 * @param mxAddress
 * @return {Promise<[]>}
 */
export async function getAddressBalance (mxAddress) {
  const response = await axios.get(`${EXPLORER_BASE_URL}/api/v1/addresses/${mxAddress}`)
  if (response.data && response.data.data && response.data.data.balances) {
    return response.data.data.balances
  }

  throw new Error('Fail to get balance info')
}

/**
 * Return coin's list
 * [key:token_name - value:price_in_bip]
 * @return {Promise<Decimal[]>}
 */
export async function getCoinExchangeList () {
  try {
    const response = await axios.get(`${EXPLORER_BASE_URL}/api/v1/coins`)
    if (response.data && response.data.data) {
      const coins = []

      await response.data.data.forEach((coin) => {
        // Given a coin supply (s), reserve balance (r), CRR (c) and a sell amount (a),
        // calculates the return for a given conversion
        // return r * (1 - (1 - a / s) ^ (1 / c))
        if (coin.symbol === DEFAULT_SYMBOL) {
          coins[coin.symbol] = 1
        } else {
          const as1c1 = new Decimal(1).minus(new Decimal(1).div(coin.volume))
            .pow(new Decimal(1).div(coin.crr))

          coins[coin.symbol] = new Decimal(coin.reserveBalance).mul(
            new Decimal(1).minus(as1c1)
          ).mul(100)
        }
      })

      return coins
    }
  } catch (error) {
    console.error(error)
  }

  return []
}

/**
 * Get BIP price in $
 * @return {Promise<Decimal>}
 */
export async function getBipPrice () {
  try {
    const response = await axios.get(COURCE_BIP_URL)
    if (response.data && response.data.data && response.data.data.price) {
      return new Decimal(response.data.data.price).div(10000)
    }
  } catch (error) {
    console.error(error)
  }

  return 0
}

/**
 * Get fiat exchange info
 * @return {Promise<Decimal[]>}
 */
export async function getFiatExchangeList () {
  try {
    const response = await axios.get(COURCE_FIAT_URL)
    if (response.data && response.data.Valute) {
      const result = []

      for (const [key, value] of Object.entries(response.data.Valute)) {
        result[key] = new Decimal(value.Value)
      }
      return result
    }
  } catch (error) {
    console.error(error)
  }

  return []
}

/**
 * @param d
 * @return {string}
 */
export function toHex (d) {
  return  ('0'+(Number(d).toString(16))).slice(-2).toUpperCase()
}

/**
 * @param value
 * @return {string}
 */
export function prettyFormat (value) {
  return Number(value).toFixed(5)
}

export function getFiatByLocale (locale) {
  const fiatLocale = {
    'en': {
      name: 'USD',
      symbol: '$',
    },
    'ru': {
      name: 'USD',
      symbol: 'руб',
    },
  }

  return fiatLocale[locale]
}