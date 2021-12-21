import * as dotenv from 'dotenv'
dotenv.config()

// USER_FEE_ALLOW_REF_LINK true인 경우 ref link로 들어온 사용자의 거래수수료의 일부를 사용자에게 지급한다.
// false라면 덱스랩에서 발생하는 모든 레퍼럴 거래수수료는 덱스랩이 가져간다.( ref link를 타고와도 제한됨 )
export const USER_FEE_ALLOW_REF_LINK = process.env.REACT_APP_ALLOW_REF_LINK || false

/*
  true = Dexlab RPC, Serum RPC 랜덤 연결
  false = Dexlab RPC로만 연결
*/
export const RANDOM_RPC_CONNECTION = false
/*
  true = Serum으로만 연결
  false = RANDOM_RPC_CONNECTION 정책에 따름
*/
export const SERUM_ONLY_RPC_CONNECTION = true

export const SPL_TOKEN_MARKETS = ['SOL', 'SRM', 'RAY', 'DXL']
export const MAIN_MARKETS_SOURCE_TYPES = ['SERUM', 'DEXLAB']
export const OFFICAL_MARKETS_SOURCE_TYPES = ['SERUM', 'DEXLAB', 'STAR_ATLAS']
export const EXTRA_MARKETS_SOURCE_TYPES = ['UNCERTIFIED', 'NOT_LISTING']
export const MAIN_MARKETS_ORDER_TYPES = ['GENERAL', 'LEVERAGE', 'MARGIN']
export const MAIN_MARKETS_NFT_TYPES = ['NFT']

export const isDev = process.env.NODE_ENV !== 'production'

export const DEXLAB_API_HOST = process.env.DEXLAB_API_HOST || 'https://api.dexlab.space'
export const DEXLAB_CHART_API_HOST = process.env.DEXLAB_CHART_API_HOST || 'https://tv-api.dexlab.space'
export const DEXLAB_CHART_API_BACKUP_HOST =
  process.env.DEXLAB_CHART_API_BACKUP_HOST || 'https://tv-backup-api.dexlab.space'
export const DEXLAB_MARKLET_API_HOST = process.env.DEXLAB_MARKLET_API_HOST || 'https://v-api.dexlab.space'
export const DEXLAB_IDO_API_HOST = process.env.DEXLAB_IDO_API_HOST || 'https://claim-api.dexlab.space'
export const DEXLAB_WHITE_LIST_API_HOST = process.env.DEXLAB_WHITE_LIST_API_HOST || 'https://whitelist-api.dexlab.space'

export const DEXLAB_RPC_HOST = process.env.DEXLAB_RPC_HOST || 'https://dexlab.rpcpool.com'
export const SOLANA_HOST = process.env.SOLANA_HOST || 'https://solana-api.projectserum.com'
export const SOLANA_SERUM_HOST = process.env.SOLANA_SERUM_HOST || 'https://solana-api.projectserum.com'

// 거래 수수료 리워드 지갑주소( 변경이 필요한 경우 .env / github env 도 수정할것 )
export const REACT_APP_USDT_REFERRAL_FEES_ADDRESS =
  process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS || 'ByBqSYkmtKth5MqcHLihUpPYA7FzNrN1g6WYJzRcmcRB'
export const REACT_APP_USDC_REFERRAL_FEES_ADDRESS =
  process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS || '5U4Rz1J153aCRc5RUbTZtQ9PnLFHRVbd4UeViPQtmRiD'
export const REACT_APP_SOL_REFERRAL_FEES_ADDRESS =
  process.env.REACT_APP_SOL_REFERRAL_FEES_ADDRESS || 'F5Y86F96uazqWaTcHcjX2RAFR6dPDDHim3QsQCfhebvL'
export const REACT_APP_SWAP_REFERRAL_FEES_ADDRESS =
  process.env.REACT_APP_SWAP_REFERRAL_FEES_ADDRESS || 'DDR9TFm23j7RJbjYWC8mHaGtYf3PHr3jjaJdUX1GRE81'

// 트레이딩 이벤트 트레킹용 수수료 리워드 지갑주소(DXL 트레이딩 이벤트)
// 이벤트용 DXL USDC지갑: 12VZD9Zhbo8SkrkPu1HsYgXeBM2zL7Ao2G37trkMbv2J
// 평상시 DXL 수수료지갑: HZcyyVMHZyBiQrSMXmNSDkeshBNoNPBmvrX2nuwspBnm
export const DEXLAB_TRADING_EVENT_DXL_TOKEN_MINT =
  process.env.DEXLAB_TRADING_EVENT_DXL_TOKEN_MINT || 'GsNzxJfFn6zQdJGeYsupJWzUAm57Ba7335mfhWvFiE9Z'
export const DEXLAB_TRADING_EVENT_DXL_V1_USDC_ADDRESS =
  process.env.DEXLAB_TRADING_EVENT_DXL_V1_USDC_ADDRESS || 'HZcyyVMHZyBiQrSMXmNSDkeshBNoNPBmvrX2nuwspBnm'

// DXL-USDC DEX V3 Market
export const DEFAULT_MARKET_ADDRESS =
  process.env.DEFAULT_MARKET_ADDRESS || '9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'

export const SOLANA_EXPLORER_URL = 'https://explorer.solana.com'
// export const SOLANA_EXPLORER_URL = 'https://solscan.io'
