/* eslint-disable react-hooks/exhaustive-deps, jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from 'react'
import _ from 'lodash'
import { Tab, Nav } from 'react-bootstrap'
import { get24hPricePercent, getDecimalCount, numberWithCommas, calCurrencyPrice } from '../utils/dexlab-utils'
import { numberToString, getSplTokens } from '../utils/utils'
import { useMarket } from '../utils/dex-markets'
import { Select, Avatar, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { DexLabMarketV2Info, MarketTableInfo } from '../utils/types'
import { getTokenName } from '../utils/tokens-v2'
import { ThemeContext, isDark } from '../utils/Contexts/ThemeContext'
import { isTablet, isBrowser } from 'react-device-detect'
import { PublicKey } from '@solana/web3.js'
import {
  // EXTRA_MARKETS_SOURCE_TYPES,
  SPL_TOKEN_MARKETS,
  MAIN_MARKETS_SOURCE_TYPES,
  OFFICAL_MARKETS_SOURCE_TYPES,
  MAIN_MARKETS_ORDER_TYPES,
  MAIN_MARKETS_NFT_TYPES,
} from '../application'
import { TokenInfo } from '@solana/spl-token-registry'

const { Option, OptGroup } = Select

const pricePercentComponet = (orgPrice: number, newPrice: number) => {
  const percent = get24hPricePercent({ orgPrice, newPrice })
  let percentColor = percent > 0 ? '#26A69A' : '#F6465D'
  if (percent === 0.0) {
    percentColor = '#FFFFFF'
  }
  return (
    <span style={{ marginLeft: '10px', color: percentColor }}>
      {percent > 0 ? '+' : ''}
      {percent.toFixed(2)}%
    </span>
  )
}

export default function SimpleMarketsTable({
  allV2Markets,
  currency,
  markPrice,
  market,
  marketName,
  setMarketAddress,
}) {
  const [theme] = useContext(ThemeContext)
  const { t: trText, i18n } = useTranslation()

  // const [isMarketLoading, setIsMarketLoading] = useState(false)
  const [selectFilter, setSelectFilter] = useState('USDC')
  const [allMarketList, setAllMarketList] = useState<MarketTableInfo[]>([])
  const [newMarketList, setNewMarketList] = useState<MarketTableInfo[]>([])
  const [favoritMarkets, setFavoritMarkets] = useState<string[]>([])
  const [solanaTokenList, setSolanaTokenList] = useState<TokenInfo[]>([])
  const [loadedSolanaTokenList, setLoadedSolanaTokenList] = useState(false)

  let isWormholeMarkets = allV2Markets.filter((f) => f.source === 'WORMHOLE').length > 0

  useEffect(() => {
    async function getSolanaTokenList() {
      const tokenList = await getSplTokens()
      setSolanaTokenList(tokenList)
    }

    const localFavorit = localStorage.getItem('favorite_market') ?? '[]'
    setFavoritMarkets(JSON.parse(localFavorit))
    getSolanaTokenList()
  }, [])

  useEffect(() => {
    if (!_.isEmpty(solanaTokenList) && !loadedSolanaTokenList) {
      onFilterMarketType(selectFilter)
      setLoadedSolanaTokenList(true)
    }
  }, [solanaTokenList])

  useEffect(() => {
    localStorage.setItem('favorite_market', JSON.stringify(favoritMarkets))
  }, [favoritMarkets])

  useEffect(() => {
    if (market && selectFilter !== 'FAVORITES') {
      // 어떤 마켓인지 구분
      const marketInfo = allV2Markets.find((f) => f.address === market.address.toBase58())
      if (
        (marketInfo && marketInfo.source === 'UNCERTIFIED') ||
        marketInfo.source === 'NFT' ||
        marketInfo.source === 'STAR_ATLAS'
      ) {
        const tabKey = marketInfo.source === 'STAR_ATLAS' ? 'NFT' : marketInfo.source
        if (selectFilter !== tabKey) {
          setSelectFilter(tabKey)
        }
      } else if (marketInfo && marketInfo.source === 'WORMHOLE') {
        setSelectFilter('WORMHOLE')
      } else {
        if ((marketInfo && marketInfo.quote === 'USDC') || marketInfo.quote === 'USDT') {
          if (marketInfo.quote !== selectFilter) {
            setSelectFilter(marketInfo.quote)
          }
        } else {
          if (marketInfo && selectFilter !== marketInfo.source) {
            setSelectFilter('SPL')
          }
        }
      }
    }
  }, [market])

  useEffect(() => {
    const newAllMarkets: MarketTableInfo[] = []
    allMarketList.forEach((mk) => {
      if (mk.symbol === marketName) {
        const tickSize = currency.standardType === 'USD' ? market?.tickSize && getDecimalCount(market.tickSize) : 0
        const selectQuoteCurrency = currency.standardType === 'USD' ? mk.symbol.split('/')[1] : currency.standardType

        let formattedMarkPrice =
          markPrice && numberWithCommas(calCurrencyPrice(markPrice, currency.lowPrice).toFixed(tickSize), currency)

        // Extra 앱아이콘 이미지
        let tokenIconUrl = mk.iconUrl
        if (mk.source === 'UNCERTIFIED') {
          if (!_.isEmpty(solanaTokenList)) {
            const findTokenInfo = solanaTokenList.find((f) => f.address === mk.baseMint)
            if (findTokenInfo && findTokenInfo.logoURI) {
              tokenIconUrl = findTokenInfo.logoURI
            }
          }
        }

        const updateMarketInfo = {
          id: mk.id,
          address: mk.address,
          name: mk.name,
          subSymbolPrefix: mk.subSymbolPrefix,
          base: mk.base,
          baseMint: mk.baseMint,
          quote: mk.quote,
          symbol: mk.symbol,
          iconUrl: tokenIconUrl,
          nftImageUrl: mk.nftImageUrl,
          deprecated: mk.deprecated,
          programId: mk.programId,
          newPrice: markPrice ?? 0,
          oldPrice: mk.hourSummary?.oldPrice ?? 0,
          hourSummary: mk.hourSummary,
          priceText: `${formattedMarkPrice ?? '-'}(${selectQuoteCurrency})`,
          priceTextHtml: (
            <>
              {formattedMarkPrice ?? '-'}
              <span style={{ fontSize: '10px', color: '#646464' }}>{selectQuoteCurrency}</span>
            </>
          ),
          // postion: mk.base === 'DXL' ? 1000000000 : mk.isNew ? 1000000001 : Number(mk.volume.toFixed(0)),
          postion: mk.base === 'DXL' ? 1000000000 : Number(mk.volume.toFixed(0)),
          isNew: mk.isNew,
          source: mk.source,
          orderType: mk.orderType,
          volume: mk.volume,
          lowPrice: mk.lowPrice,
          highPrice: mk.highPrice,
        }
        newAllMarkets.push(updateMarketInfo)

        if (!_.isEmpty(newMarketList)) {
          const changeNewMarketList: any[] = []
          newMarketList.forEach((newMarket) => {
            if (newMarket.symbol === marketName) {
              changeNewMarketList.push(updateMarketInfo)
            } else {
              changeNewMarketList.push(newMarket)
            }
          })
          setNewMarketList(changeNewMarketList)
        }
      } else {
        newAllMarkets.push(mk)
      }
    })

    setAllMarketList(newAllMarkets)
  }, [markPrice])

  useEffect(() => {
    onFilterMarketType(selectFilter)
  }, [selectFilter])

  // const extractBase = (a) => a.split('/')[0]
  const extractQuote = (a) => a.split('/')[1]

  const onSelectMarket = (address) => {
    setMarketAddress(address.toBase58())
  }

  const onFilterMarketType = (type: string) => {
    const newMarkets = getAllMarketList()
      .filter((f) => f.source === 'DEXLAB')
      .filter((f) => f.isNew)
    setNewMarketList(newMarkets)

    if (type === 'USDT') {
      setAllMarketList(getAllMailMarketListByOffical().filter((market) => extractQuote(market.symbol) === 'USDT'))
    } else if (type === 'USDC') {
      setAllMarketList(getAllMailMarketListByOffical().filter((market) => extractQuote(market.symbol) === 'USDC'))
    } else if (type === 'SPL') {
      setAllMarketList(
        getAllMailMarketListByOffical().filter((market) => SPL_TOKEN_MARKETS.includes(extractQuote(market.symbol))),
      )
    } else if (type === 'WORMHOLE') {
      const wormholeMarkets = getAllMarketList().filter((f) => f.source === 'WORMHOLE')
      const nonePrice = wormholeMarkets.filter((f) => !f.hourSummary)
      const blankPrice = wormholeMarkets.filter((f) => f.hourSummary)
      setAllMarketList([...nonePrice, ...blankPrice])
    } else if (type === 'FAVORITES') {
      setAllMarketList(getAllMarketList().filter((ft) => favoritMarkets.find((fav) => fav === ft.address.toBase58())))
    } else if (type === 'UNCERTIFIED') {
      const uncertifiedMarkets = getAllMarketList().filter((f) => f.source === 'UNCERTIFIED')
      setAllMarketList(uncertifiedMarkets)
    } else if (type === 'NFT') {
      setAllMarketList(getAllNftMarketListByOffical())
    } else {
      setAllMarketList(getAllMarketList())
    }
    // setSelectFilter(type)
  }

  const addOrRemoveFavoritMarket = (address: string) => {
    const currentAddress = favoritMarkets.find((fa) => fa === address)
    if (currentAddress) {
      setFavoritMarkets([...favoritMarkets.filter((ft) => ft !== address)])
    } else {
      setFavoritMarkets([...favoritMarkets, address])
    }
  }

  // 모든 공식 마켓(NFT마켓 포함)
  function getAllMarketListByOffical() {
    return getAllMarketList().filter((f) => OFFICAL_MARKETS_SOURCE_TYPES.includes(f.source))
  }

  // 공식 USDC,USDT,SPL 탭에 노출될 모든 마켓
  function getAllMailMarketListByOffical() {
    return getAllMarketList()
      .filter((f) => MAIN_MARKETS_SOURCE_TYPES.includes(f.source))
      .filter((f) => MAIN_MARKETS_ORDER_TYPES.includes(f.orderType))
  }

  // 공식 NFT 마켓
  function getAllNftMarketListByOffical() {
    return getAllMarketListByOffical().filter((f) => MAIN_MARKETS_NFT_TYPES.includes(f.orderType))
  }

  function getAllMarketList() {
    const marketList: MarketTableInfo[] = []
    if (allV2Markets) {
      allV2Markets.forEach((marketInfo: DexLabMarketV2Info, i) => {
        const selectQuoteCurrency =
          currency.standardType === 'USD' ? marketInfo.symbol.split('/')[1] : currency.standardType

        let priceText = '-'
        let priceTextHtml: any = '-'
        if (marketInfo.hourSummary) {
          // 현재 선택된 마켓이라면 RPC가격 데이터를 사용
          if (marketInfo.hourSummary.address === market?.address.toBase58()) {
            const tickSize = currency.standardType === 'USD' ? market?.tickSize && getDecimalCount(market.tickSize) : 0
            priceText = markPrice
              ? `${numberWithCommas(
                  calCurrencyPrice(markPrice, currency.lowPrice).toFixed(tickSize),
                  currency,
                )}(${selectQuoteCurrency})`
              : '-'
            priceTextHtml = markPrice ? (
              <>
                {numberWithCommas(calCurrencyPrice(markPrice, currency.lowPrice).toFixed(tickSize), currency)}
                <span style={{ fontSize: '10px', color: '#646464' }}>{selectQuoteCurrency}</span>
              </>
            ) : (
              '-'
            )
          } else {
            if (marketInfo.hourSummary?.marketPrice) {
              const calPrice = calCurrencyPrice(parseFloat(marketInfo.hourSummary.marketPrice), currency.lowPrice)
              priceText = `${numberWithCommas(Number(calPrice), currency) ?? '-'}(${selectQuoteCurrency})`
              priceTextHtml = (
                <>
                  {numberWithCommas(Number(calPrice), currency) ?? '-'}
                  <span style={{ fontSize: '10px', color: '#646464' }}>{selectQuoteCurrency}</span>
                </>
              )
            }
          }
        }

        // Extra 앱아이콘 이미지
        let tokenIconUrl = marketInfo.iconUrl
        if (marketInfo.source === 'UNCERTIFIED') {
          if (!_.isEmpty(solanaTokenList)) {
            const findTokenInfo = solanaTokenList.find((f) => f.address === marketInfo.baseMint)
            if (findTokenInfo && findTokenInfo.logoURI) {
              tokenIconUrl = findTokenInfo.logoURI
            }
          }
        }

        marketList.push({
          id: i,
          address: new PublicKey(marketInfo.address),
          iconUrl: tokenIconUrl,
          nftImageUrl: marketInfo.nftImageUrl,
          name: getTokenName(marketInfo, i18n.language) ?? marketInfo.symbol,
          subSymbolPrefix: marketInfo.subSymbolPrefix,
          base: marketInfo.base,
          baseMint: marketInfo.baseMint,
          quote: marketInfo.quote,
          symbol: marketInfo.symbol,
          deprecated: false,
          programId: new PublicKey(marketInfo.programId),
          priceText,
          priceTextHtml,
          newPrice: Number(marketInfo.hourSummary?.newPrice ?? 0),
          oldPrice: Number(marketInfo.hourSummary?.oldPrice ?? 0),
          // postion:
          //   marketInfo.base === 'DXL'
          //     ? 1000000000
          //     : marketInfo.isNew
          //     ? 1000000001
          //     : Number(marketInfo.summary.volume.toFixed(0)),
          postion: marketInfo.base === 'DXL' ? 1000000000 : Number(marketInfo.summary.volume.toFixed(0)),
          isNew: marketInfo.isNew ?? false,
          source: marketInfo.source,
          hourSummary: marketInfo.hourSummary,
          orderType: marketInfo.orderType,
          volume: marketInfo.summary.volume,
          lowPrice: marketInfo.summary.lowPrice,
          highPrice: marketInfo.summary.highPrice,
        })
      })
    }
    return marketList
  }

  function ViewMarketHeader() {
    return (
      <thead>
        <tr style={{ textAlign: 'right' }}>
          <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b', textAlign: 'left' }}>{trText('market')}</th>
          <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b' }}>{trText('last_order_price')}</th>
          {(isTablet || isBrowser) && (
            <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b' }}>{trText('chage_24h')}</th>
          )}
          {(isTablet || isBrowser) && (
            <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b' }}>{trText('market_table_volume_24h')}</th>
          )}
        </tr>
      </thead>
    )
  }

  function ViewUncertifiedMarketHeader() {
    return (
      <thead>
        <tr style={{ textAlign: 'right' }}>
          <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b', textAlign: 'left' }}>{trText('market')}</th>
          <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b' }}>{trText('last_order_price')}</th>
          {(isTablet || isBrowser) && (
            <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b' }}>{trText('chage_24h')}</th>
          )}
          {(isTablet || isBrowser) && (
            <th style={{ color: isDark(theme) ? '#FFFFFF' : '#2b2b2b' }}>{trText('market_table_volume_24h')}</th>
          )}
        </tr>
      </thead>
    )
  }

  // function MarketLoading() {
  //   if (isMarketLoading) {
  //     return (
  //       <div style={{ textAlign: 'center', marginTop: '30px' }}>
  //         <Spin size="default" />
  //       </div>
  //     )
  //   } else {
  //     return null
  //   }
  // }

  function ViewUncertifiedMarketList({ isSymbol }) {
    const sortAllMarketList = allMarketList && _.sortBy(allMarketList, (s) => Number(s.postion)).reverse()
    return (
      <tbody>
        {sortAllMarketList &&
          sortAllMarketList.map(
            ({ iconUrl, address, symbol, name, priceTextHtml, newPrice, oldPrice, volume, isNew }, i) => {
              return (
                <tr key={i} style={{ textAlign: 'right' }}>
                  <td
                    style={{
                      textAlign: 'left',
                      fontWeight: marketName === symbol ? 'bold' : 'normal',
                      color: marketName === symbol ? (isDark(theme) ? '#FFFFFF' : '#22223e') : '',
                      cursor: 'pointer',
                    }}
                  >
                    <i
                      className="mdi mdi-star"
                      style={{
                        color: favoritMarkets.find((fa) => fa === address.toBase58()) ? '#f4d03f' : '',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        addOrRemoveFavoritMarket(address.toBase58())
                      }}
                    ></i>
                    <span
                      onClick={() => {
                        onSelectMarket(address)
                      }}
                    >
                      <Avatar style={{ marginRight: '5px' }} src={iconUrl} size={15} />
                      {isSymbol ? symbol : name} {isNew ? <Tag color="#1652F0">N</Tag> : null}
                      {isSymbol && <div style={{ fontSize: '12px', color: '#646464', marginLeft: '20px' }}>{name}</div>}
                    </span>
                  </td>
                  <td
                    style={{
                      fontWeight: marketName === symbol ? 'bold' : 'normal',
                      color: marketName === symbol ? (isDark(theme) ? '#FFFFFF' : '#22223e') : '',
                      cursor: 'pointer',
                    }}
                  >
                    {priceTextHtml}
                  </td>
                  {(isTablet || isBrowser) && (
                    <td>{oldPrice && newPrice ? pricePercentComponet(oldPrice, newPrice) : '-'}</td>
                  )}
                  {(isTablet || isBrowser) && <td>{numberToString(parseFloat(volume.toFixed(2)))}</td>}
                </tr>
              )
            },
          )}
      </tbody>
    )
  }

  function ViewNewMarketList() {
    const sortAllMarketList = newMarketList && _.sortBy(newMarketList, (s) => Number(s.postion)).reverse()
    return sortAllMarketList && !_.isEmpty(sortAllMarketList)
      ? sortAllMarketList.map(
          ({ iconUrl, address, symbol, name, priceTextHtml, newPrice, oldPrice, volume, isNew }, i) => {
            return (
              <tr key={i} style={{ textAlign: 'right' }}>
                <td
                  style={{
                    textAlign: 'left',
                    fontWeight: marketName === symbol ? 'bold' : 'normal',
                    color: marketName === symbol ? (isDark(theme) ? '#FFFFFF' : '#22223e') : '',
                    cursor: 'pointer',
                  }}
                >
                  <i
                    className="mdi mdi-star"
                    style={{
                      color: favoritMarkets.find((fa) => fa === address.toBase58()) ? '#f4d03f' : '',
                      marginRight: '5px',
                    }}
                    onClick={() => {
                      addOrRemoveFavoritMarket(address.toBase58())
                    }}
                  ></i>
                  <span
                    onClick={() => {
                      onSelectMarket(address)
                    }}
                  >
                    <Avatar style={{ marginRight: '5px' }} src={iconUrl} size={15} />
                    {symbol}
                    <span style={{ fontSize: '12px', color: '#646464', marginLeft: '2px' }}>{name}</span>{' '}
                    {isNew ? <Tag color="#1652F0">N</Tag> : null}
                  </span>
                </td>
                <td
                  style={{
                    fontWeight: marketName === symbol ? 'bold' : 'normal',
                    color: marketName === symbol ? (isDark(theme) ? '#FFFFFF' : '#22223e') : '',
                    cursor: 'pointer',
                  }}
                >
                  {priceTextHtml}
                </td>
                {(isTablet || isBrowser) && (
                  <td>{oldPrice && newPrice ? pricePercentComponet(oldPrice, newPrice) : '-'}</td>
                )}
                {(isTablet || isBrowser) && <td>{numberToString(parseFloat(volume.toFixed(2)))}</td>}
              </tr>
            )
          },
        )
      : null
  }

  function ViewMarketList({ marketType, isSymbol }) {
    const sortAllMarketList = allMarketList && _.sortBy(allMarketList, (s) => Number(s.postion)).reverse()
    return (
      <tbody>
        {ViewNewMarketList()}
        {sortAllMarketList &&
          sortAllMarketList.map(
            (
              { iconUrl, nftImageUrl, address, symbol, name, source, priceTextHtml, newPrice, oldPrice, volume, isNew },
              i,
            ) => {
              return (
                <tr key={i} style={{ textAlign: 'right' }}>
                  <td
                    style={{
                      textAlign: 'left',
                      fontWeight: marketName === symbol ? 'bold' : 'normal',
                      color: marketName === symbol ? (isDark(theme) ? '#FFFFFF' : '#22223e') : '',
                      cursor: 'pointer',
                    }}
                  >
                    <i
                      className="mdi mdi-star"
                      style={{
                        color: favoritMarkets.find((fa) => fa === address.toBase58()) ? '#f4d03f' : '',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        addOrRemoveFavoritMarket(address.toBase58())
                      }}
                    ></i>
                    <span
                      style={{ width: '100%' }}
                      onClick={() => {
                        onSelectMarket(address)
                      }}
                    >
                      <Avatar style={{ marginRight: '5px' }} src={iconUrl} size={15} />
                      {name}
                      {/* {EXTRA_MARKETS_SOURCE_TYPES.includes(source) ? (
                        <Tag color="orange">{trText('market_tab_extra_market')}</Tag>
                      ) : isNew ? (
                        <Tag color="#1652F0">N</Tag>
                      ) : null} */}
                    </span>
                  </td>
                  <td
                    style={{
                      fontWeight: marketName === symbol ? 'bold' : 'normal',
                      color: marketName === symbol ? (isDark(theme) ? '#FFFFFF' : '#22223e') : '',
                      cursor: 'pointer',
                    }}
                  >
                    {priceTextHtml}
                  </td>
                  {(isTablet || isBrowser) && (
                    <td>{oldPrice && newPrice ? pricePercentComponet(oldPrice, newPrice) : '-'}</td>
                  )}
                  {(isTablet || isBrowser) && <td>{numberToString(parseFloat(volume.toFixed(2)))}</td>}
                </tr>
              )
            },
          )}
      </tbody>
    )
  }

  return (
    <>
      <Tab.Container defaultActiveKey="USDC">
        <div className="card">
          <MarketSelector
            theme={theme}
            markets={allV2Markets}
            placeholder={trText('placeholder_select_market')}
            favoritMarkets={favoritMarkets}
          />
          <div className="card-header">
            <Nav
              variant="pills"
              activeKey={selectFilter}
              onSelect={(key) => {
                setSelectFilter(key ?? 'USDC')
              }}
            >
              <Nav.Link active={selectFilter === 'FAVORITES'} eventKey="FAVORITES">
                <i style={{ color: '#FFFF00' }} className="mdi mdi-star" />
              </Nav.Link>
              <Nav.Link active={selectFilter === 'USDC'} eventKey="USDC">
                USDC
              </Nav.Link>
              <Nav.Link active={selectFilter === 'USDT'} eventKey="USDT">
                USDT
              </Nav.Link>
              {isWormholeMarkets && (
                <Nav.Link active={selectFilter === 'WORMHOLE'} eventKey="WORMHOLE">
                  WORMHOLE
                </Nav.Link>
              )}
              <Nav.Link active={selectFilter === 'SPL'} eventKey="SPL">
                SPL
              </Nav.Link>
              {!_.isEmpty(getAllNftMarketListByOffical()) && (
                <Nav.Link active={selectFilter === 'NFT'} eventKey="NFT">
                  NFT
                </Nav.Link>
              )}
              <Nav.Link active={selectFilter === 'UNCERTIFIED'} eventKey="UNCERTIFIED">
                {trText('market_tab_extra_market')}
              </Nav.Link>
            </Nav>
          </div>
          <div className="card-body price-pair" style={{ height: '100%' }}>
            {/* {!isMarketLoading ? ( */}
            <Tab.Content>
              <Tab.Pane eventKey="ALL" active={selectFilter === 'ALL'}>
                <table className="table">
                  <ViewMarketHeader />
                  {selectFilter === 'ALL' ? <ViewMarketList marketType="ALL" isSymbol={false} /> : null}
                </table>
              </Tab.Pane>
              <Tab.Pane eventKey="FAVORITES" active={selectFilter === 'FAVORITES'}>
                {!_.isEmpty(favoritMarkets) ? (
                  <table className="table">
                    <ViewMarketHeader />
                    {selectFilter === 'FAVORITES' ? <ViewMarketList marketType="FAVORITES" isSymbol={false} /> : null}
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <div style={{ color: 'white', textAlign: 'center' }}>{trText('favorite_new')}</div>
                    <p style={{ marginBottom: '20px', textAlign: 'center' }}>
                      <i className="mdi mdi-star"></i>
                      {trText('favorite_new_description')}
                    </p>
                  </div>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="USDC" active={selectFilter === 'USDC'}>
                <table className="table">
                  <ViewMarketHeader />
                  {/* {!_.isEmpty(newMarketList) ? <ViewNewMarketList /> : null} */}
                  {selectFilter === 'USDC' ? <ViewMarketList marketType="USDC" isSymbol={true} /> : null}
                </table>
              </Tab.Pane>
              <Tab.Pane eventKey="USDT" active={selectFilter === 'USDT'}>
                <table className="table">
                  <ViewMarketHeader />
                  {selectFilter === 'USDT' ? <ViewMarketList marketType="USDT" isSymbol={true} /> : null}
                </table>
              </Tab.Pane>
              <Tab.Pane eventKey="WORMHOLE" active={selectFilter === 'WORMHOLE'}>
                <table className="table">
                  <ViewMarketHeader />
                  {selectFilter === 'WORMHOLE' ? <ViewMarketList marketType="WORMHOLE" isSymbol={true} /> : null}
                </table>
              </Tab.Pane>
              <Tab.Pane eventKey="SPL" active={selectFilter === 'SPL'}>
                <table className="table">
                  <ViewMarketHeader />
                  {selectFilter === 'SPL' ? <ViewMarketList marketType="SPL" isSymbol={true} /> : null}
                </table>
              </Tab.Pane>
              <Tab.Pane eventKey="NFT" active={selectFilter === 'NFT'}>
                <table style={{ marginTop: '10px' }} className="table">
                  <ViewUncertifiedMarketHeader />
                  {selectFilter === 'NFT' ? <ViewMarketList marketType="NFT" isSymbol={true} /> : null}
                </table>
              </Tab.Pane>
              <Tab.Pane eventKey="UNCERTIFIED" active={selectFilter === 'UNCERTIFIED'}>
                <table style={{ marginTop: '10px' }} className="table">
                  <ViewUncertifiedMarketHeader />
                  {selectFilter === 'UNCERTIFIED' ? <ViewUncertifiedMarketList isSymbol={true} /> : null}
                </table>
              </Tab.Pane>
            </Tab.Content>
            {/* ) : (
              <MarketLoading />
            )} */}
          </div>
        </div>
      </Tab.Container>
    </>
  )
}

function MarketSelector({ theme, markets, placeholder, favoritMarkets }) {
  const { t: trText } = useTranslation()
  const { market, setMarketAddress } = useMarket()

  const onSetMarketAddress = (marketAddress) => {
    setMarketAddress(marketAddress)
  }

  const extractBase = (a) => a.split('/')[0]
  const extractQuote = (a) => a.split('/')[1]

  const selectedMarket = markets.find(
    (proposedMarket) => market?.address && new PublicKey(proposedMarket.address).equals(market.address),
  )?.address

  return (
    <Select
      showSearch
      size={'large'}
      style={{ width: '100%', padding: '3px' }}
      placeholder={placeholder || trText('placeholder_select_market')}
      optionFilterProp="name"
      onSelect={onSetMarketAddress}
      listHeight={400}
      value={selectedMarket}
      filterOption={(input, option) => option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <OptGroup label="Markets">
        {markets
          .sort((a, b) =>
            extractQuote(a.symbol) === 'USDT' && extractQuote(b.symbol) !== 'USDT'
              ? -1
              : extractQuote(a.symbol) !== 'USDT' && extractQuote(b.symbol) === 'USDT'
              ? 1
              : 0,
          )
          .sort((a, b) =>
            extractBase(a.symbol) < extractBase(b.symbol) ? -1 : extractBase(a.symbol) > extractBase(b.symbol) ? 1 : 0,
          )
          .map(({ name, symbol, iconUrl, nftImageUrl, address, base, quote, deprecated }, i) => (
            <Option
              value={address}
              key={address}
              name={symbol}
              style={{
                padding: '10px',
                color: isDark(theme) ? '#FFFFFF' : '#2b2b2b',
              }}
            >
              <i
                className="mdi mdi-star"
                style={{
                  color: favoritMarkets.find((fa) => fa === address) ? '#f4d03f' : '',
                  marginRight: '5px',
                }}
              ></i>{' '}
              <Avatar size={20} style={{ marginRight: '5px', marginBottom: '5px' }} src={iconUrl} />
              {name}
              <span style={{ fontSize: '12px' }}>({`${base}/${quote}`})</span>{' '}
              {deprecated ? ` (${trText('deprecated')})` : null}
            </Option>
          ))}
      </OptGroup>
    </Select>
  )
}
