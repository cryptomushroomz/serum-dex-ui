/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useState } from 'react';
import { Avatar, Button, Tag, Tooltip } from 'antd';
import { SwapOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getDecimalCount } from '../utils/utils';
import { numberWithCommas, calCurrencyPrice } from '../utils/dexlab-utils';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'react-use';
import SelectCoinHeader from '../componentsv2/SelectCoinHeader';
import { getTokenName } from '../utils/tokens-v2';
import { ThemeContext, isDark } from '../utils/Contexts/ThemeContext';
import { EXTRA_MARKETS_SOURCE_TYPES } from '../application';
import HistoryApi from '../utils/client/chartDataConnector';
import { useEffect } from 'react';
import { SWAP_BETA_MARKETS } from '../utils/market-list';
import CoingeckoApi from '../utils/client/coingeckoConnector';

export default function HeaderCoinSummary({
  selectedMarket,
  lpPool,
  markPrice,
  currency,
  market,
  baseCurrency,
  quoteCurrency,
  viewProjectInfo,
  viewLpPoolInfo,
  setViewProjectInfo,
  setViewLpPoolInfo,
}) {
  const [theme] = useContext(ThemeContext);
  const [coingeckoPrice, setCoingeckoPrice] = useState(undefined);
  const [marketDayVolume, setMarketDayVolume] = useState({
    market: `${baseCurrency}/${quoteCurrency}`,
    price: 0,
    size: 0,
  });
  const { t: trText, i18n } = useTranslation();

  let lowPrice = selectedMarket.summary.lowPrice;
  let highPrice = selectedMarket.summary.highPrice;
  let tickSize =
    currency.standardType === 'USD'
      ? market?.tickSize && getDecimalCount(market.tickSize)
      : 0;
  let selectQuoteCurrency =
    currency.standardType === 'USD' ? quoteCurrency : currency.standardType;

  // 1분단위로 거래볼륨 갱신
  useInterval(() => {
    getDayVolume();
    globalCurrencPrice();
  }, 60000);

  // 최초 1회 실행
  useEffect(() => {
    getDayVolume();
    globalCurrencPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 코인게코 글로벌 시세 조회
  async function globalCurrencPrice() {
    if (selectedMarket.coingeckoId) {
      const response = await CoingeckoApi.getTokenPrice(
        selectedMarket.coingeckoId,
      );
      if (response) {
        setCoingeckoPrice(response.market_data.current_price.usd);
      }
    }
  }

  async function getDayVolume() {
    const response = await HistoryApi.getMarkeyDayVolume(
      `${selectedMarket.subSymbolPrefix ?? ''}${baseCurrency.replace(
        '*',
        '',
      )}/${quoteCurrency}`,
    );
    if (response) {
      setMarketDayVolume(response);
    }
  }

  // if (tradeHistory && !_.isEmpty(tradeHistory)) {
  //   tickSize = currency.standardType === 'USD' ? market?.tickSize && getDecimalCount(market.tickSize) : 0
  //   selectQuoteCurrency = currency.standardType === 'USD' ? quoteCurrency : currency.standardType
  //   lowPrice = _.minBy(tradeHistory, (it) => it.price).price
  //   highPrice = _.maxBy(tradeHistory, (it) => it.price).price
  // }

  return (
    <div className="card-body">
      <div className="row">
        <div
          className="col-xl-12 col-lg-12 col-md-12 col-xxl-12"
          style={{
            borderBottom: `2px solid ${isDark(theme) ? '#434a59' : '#d4d6dc'}`,
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              color: isDark(theme) ? '#FFFFFF' : '#2b2b2b',
              fontFamily: 'Noto Sans KR,sans-serif',
            }}
          >
            <Avatar
              style={{ marginRight: '5px', marginBottom: '5px' }}
              src={selectedMarket.iconUrl}
            />
            {getTokenName(selectedMarket, i18n.language)}
          </span>{' '}
          {selectedMarket &&
            selectQuoteCurrency &&
            `${selectedMarket.base}/${selectQuoteCurrency ?? ''}`}{' '}
          {selectedMarket &&
            EXTRA_MARKETS_SOURCE_TYPES.includes(selectedMarket.source) && (
              <Tag color="orange">{trText('market_tab_extra_market_tag')}</Tag>
            )}
          {selectedMarket && !viewLpPoolInfo && (
            <span style={{ float: 'right', cursor: 'pointer' }}>
              <Button
                shape="round"
                onClick={() => {
                  setViewProjectInfo(!viewProjectInfo);
                }}
              >
                {viewProjectInfo ? 'Hide ' : ''}Token Info
              </Button>
            </span>
          )}
          {market && SWAP_BETA_MARKETS.includes(market.address.toBase58()) && (
            <span
              style={{ float: 'right', cursor: 'pointer', marginRight: '6px' }}
            >
              <Button
                style={{
                  padding: 0,
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
                shape="round"
                onClick={() => {
                  window.location.href = `/#/swap${`?id=${
                    market ? market.address.toBase58() : ''
                  }`}`;
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <SwapOutlined
                    style={{
                      fontSize: '17px',
                      marginRight: '6px',
                      marginBottom: '3px',
                    }}
                  />
                  {trText('swap')}
                </div>
              </Button>
            </span>
          )}
          {selectedMarket && !viewProjectInfo && lpPool && (
            <span
              style={{ float: 'right', cursor: 'pointer', marginRight: '6px' }}
            >
              <Button
                style={{
                  padding: 0,
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
                shape="round"
                onClick={() => {
                  setViewLpPoolInfo(!viewLpPoolInfo);
                }}
              >
                <div style={{ fontSize: '12px' }}>
                  {viewLpPoolInfo ? 'Hide ' : ''}
                  <img
                    style={{ height: '25px', marginRight: '6px' }}
                    src={require('../images/raydium_logo.svg')}
                  />
                  <span>Pool</span>
                </div>
              </Button>
            </span>
          )}
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-xxl-4">
          <div>
            {selectedMarket && currency ? (
              <SelectCoinHeader
                markPrice={markPrice ?? 0}
                selectedMarket={selectedMarket}
                currency={currency}
              />
            ) : null}
          </div>
        </div>
        <div
          style={{ textAlign: 'right' }}
          className="col-xl-8 col-lg-8 col-md-8 col-xxl-8"
        >
          <div className="row" style={{ marginTop: '5px' }}>
            <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
              {trText('high_price')}
            </div>
            <div
              className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
              style={{
                color: '#26A69A',
                borderBottom: `1px solid ${
                  isDark(theme) ? '#434a59' : '#d4d6dc'
                }`,
                fontWeight: 'bold',
              }}
            >
              {market &&
                numberWithCommas(
                  calCurrencyPrice(highPrice, currency.lowPrice).toFixed(
                    tickSize,
                  ),
                  currency,
                )}
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
              {trText('volume_24h')}
            </div>
            <div
              className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
              style={{
                borderBottom: `1px solid ${
                  isDark(theme) ? '#434a59' : '#d4d6dc'
                }`,
              }}
            >
              {market &&
                numberWithCommas(
                  parseFloat(marketDayVolume.size.toFixed(tickSize)),
                  currency,
                )}{' '}
              <span
                style={{
                  fontSize: '11px',
                  color: '#999',
                  letterSpacing: '.05em',
                }}
              >
                {baseCurrency && baseCurrency.replace('*', '')}
              </span>
            </div>
          </div>

          <div className="row" style={{ marginTop: '13px' }}>
            <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
              {trText('low_price')}
            </div>
            <div
              className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
              style={{
                color: '#F6465D',
                borderBottom: `1px solid ${
                  isDark(theme) ? '#434a59' : '#d4d6dc'
                }`,
                fontWeight: 'bold',
              }}
            >
              {market &&
                numberWithCommas(
                  parseFloat(
                    calCurrencyPrice(lowPrice, currency.lowPrice).toFixed(
                      tickSize,
                    ),
                  ),
                  currency,
                )}
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
              {trText('volume_price_24h')}
            </div>
            <div
              className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
              style={{
                borderBottom: `1px solid ${
                  isDark(theme) ? '#434a59' : '#d4d6dc'
                }`,
              }}
            >
              {market &&
                numberWithCommas(
                  parseFloat(
                    calCurrencyPrice(
                      marketDayVolume.price,
                      currency.lowPrice,
                    ).toFixed(tickSize),
                  ),
                  currency,
                )}{' '}
              <span
                style={{
                  fontSize: '11px',
                  color: '#999',
                  letterSpacing: '.05em',
                }}
              >
                {selectQuoteCurrency}
              </span>
            </div>
          </div>
        </div>
      </div>
      {coingeckoPrice && (
        <div style={{ fontSize: '11px', color: '#646464' }}>
          <Tooltip title="Current Coingecko global pricing information.">
            <span style={{ fontSize: '11px', color: '#646464' }}>
              Global Price: {`${coingeckoPrice} USD`}
            </span>{' '}
            <QuestionCircleOutlined
              style={{ fontSize: '12px', color: '#646464' }}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
