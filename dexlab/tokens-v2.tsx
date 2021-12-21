import { useMemo } from 'react'
import * as BufferLayout from 'buffer-layout'
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { DexLabMarketV2Info, TokenAccount } from './types'
import { TOKEN_MINTS } from '@project-serum/serum'
import { useCustomMarkets, useTokenAccounts } from './dex-markets'
import { getMultipleSolanaAccounts } from './send'
import { useDexlabRpcConnection } from './connection'
import { useAsyncData } from './fetch-loop'
import tuple from 'immutable-tuple'
import BN from 'bn.js'

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
])

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(36),
  BufferLayout.blob(8, 'supply'),
  BufferLayout.u8('decimals'),
  BufferLayout.u8('initialized'),
  BufferLayout.blob(36),
])

export function getTokenSymbolImageUrl(quote: string) {
  return `https://github.com/dexlab-project/assets/blob/master/tokens/solana/${quote.toLowerCase()}/symbol.png?raw=true`
}

export function parseTokenAccountData(data: Buffer): { mint: PublicKey; owner: PublicKey; amount: number } {
  let { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data)
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount,
  }
}

export interface MintInfo {
  decimals: number
  initialized: boolean
  supply: BN
}

export function parseTokenMintData(data): MintInfo {
  let { decimals, initialized, supply } = MINT_LAYOUT.decode(data)
  return {
    decimals,
    initialized: !!initialized,
    supply: new BN(supply, 10, 'le'),
  }
}

export function getOwnedAccountsFilters(publicKey: PublicKey) {
  return [
    {
      memcmp: {
        offset: ACCOUNT_LAYOUT.offsetOf('owner'),
        bytes: publicKey.toBase58(),
      },
    },
    {
      dataSize: ACCOUNT_LAYOUT.span,
    },
  ]
}

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
export async function getOwnedTokenMultipleAccounts(
  connection: Connection,
  publicKey: PublicKey,
): Promise<Array<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }>> {
  const resp = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })
  return (
    resp?.value.map(({ pubkey, account: { data, executable, owner, lamports } }, idx) => {
      return {
        publicKey: pubkey,
        accountInfo: {
          data,
          executable,
          owner: new PublicKey(owner),
          lamports,
        },
      }
    }) ?? []
  )
}
// export async function getOwnedTokenAccounts(
//   connection: Connection,
//   publicKey: PublicKey,
// ): Promise<Array<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }>> {
//   let filters = getOwnedAccountsFilters(publicKey)
//   let resp = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
//     filters,
//   })
//   return resp.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
//     publicKey: new PublicKey(pubkey),
//     accountInfo: {
//       data,
//       executable,
//       owner: new PublicKey(owner),
//       lamports,
//     },
//   }))
// }

export async function getTokenAccountInfo(connection: Connection, ownerAddress: PublicKey) {
  let [splAccounts, account] = await Promise.all([
    getOwnedTokenMultipleAccounts(connection, ownerAddress),
    connection.getAccountInfo(ownerAddress),
  ])
  const parsedSplAccounts: TokenAccount[] = splAccounts.map(({ publicKey, accountInfo }) => {
    return {
      pubkey: publicKey,
      account: accountInfo,
      effectiveMint: parseTokenAccountData(accountInfo.data).mint,
    }
  })
  return parsedSplAccounts.concat({
    pubkey: ownerAddress,
    account,
    effectiveMint: WRAPPED_SOL_MINT,
  })
}

// todo: use this to map custom mints to custom tickers. Add functionality once custom markets store mints
export function useMintToTickers(): { [mint: string]: string } {
  const { customMarkets } = useCustomMarkets()
  return useMemo(() => {
    return Object.fromEntries(TOKEN_MINTS.map((mint) => [mint.address.toBase58(), mint.name]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customMarkets.length])
}

const _VERY_SLOW_REFRESH_INTERVAL = 5000 * 1000

export function useMintInfosV2(
  allMarkets: any[],
): [
  (
    | {
        [mintAddress: string]: {
          decimals: number
          initialized: boolean
        } | null
      }
    | null
    | undefined
  ),
  boolean,
] {
  const connection = useDexlabRpcConnection()
  const [tokenAccounts] = useTokenAccounts()

  const allMints = (tokenAccounts || [])
    .map((account) => account.effectiveMint)
    .concat((allMarkets || []).map((marketInfo) => marketInfo.market.baseMintAddress))
    .concat((allMarkets || []).map((marketInfo) => marketInfo.market.quoteMintAddress))
  const uniqueMints = [...new Set(allMints.map((mint) => mint.toBase58()))].map(
    (stringMint) => new PublicKey(stringMint),
  )

  const getAllV2MintInfo = async () => {
    const mintInfos = await getMultipleSolanaAccounts(connection, uniqueMints)
    return Object.fromEntries(
      Object.entries(mintInfos.value).map(([key, accountInfo]) => [
        key,
        accountInfo && parseTokenMintData(accountInfo.data),
      ]),
    )
  }

  return useAsyncData(
    getAllV2MintInfo,
    tuple('getAllV2MintInfo', connection, (tokenAccounts || []).length, (allMarkets || []).length),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL },
  )
}

export function getTokenName(market: DexLabMarketV2Info, lang) {
  // if (market.source !== 'UNCERTIFIED') {
  if (lang === 'en') {
    return market.nameEn
  } else if (lang === 'ko') {
    return market.nameKr
  } else {
    return market.nameEn
  }
  // } else {
  //   return `${market.base}/${market.quote}`
  // }
}
