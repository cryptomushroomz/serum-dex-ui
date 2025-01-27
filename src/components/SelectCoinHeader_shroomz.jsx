import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  useMarket,
  useOrderbook,
  useMarkPrice,
  useSelectedTokenAccounts,
  MarketProvider,
  getTradePageUrl,
  getTokenSymbolImageUrl,
} from '../utils/markets';
import { isEqual, getDecimalCount } from '../utils/utils';
import {
  get24hPricePercent,
  numberWithCommas,
  calCurrencyPrice,
} from '../utils/dexlab-utils';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import DexLabApi from '../utils/client/dexlabApiConnector';

function refreshPriceHistoryInterval(setCallPriceHistoryTime) {
  setInterval(() => {
    setCallPriceHistoryTime(moment.valueOf());
  }, 30000);
}

export default function SelectCoinHeader({ selectedMarket, currency }) {
  const markPrice = useMarkPrice();
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const [last24hOrderPrice, setLast24hOrderPrice] = useState(null);
  const [callPriceHistoryTime, setCallPriceHistoryTime] = useState(
    moment.valueOf(),
  );

  // 60초에 한번씩 히스토리 가격을 재조회
  useEffect(() => {
    refreshPriceHistoryInterval(setCallPriceHistoryTime);
  }, []);

  useEffect(() => {
    async function getMarketLastPrice() {
      if (selectedMarket) {
        DexLabApi.getMarketCurrent24hPrice(`${market?.address.toBase58()}`)
          .then((res) => {
            if (res) {
              setLast24hOrderPrice(res.price);
            } else {
              setLast24hOrderPrice('0.0');
            }
          })
          .catch((e) => {
            setLast24hOrderPrice('0.0');
          });
      }
    }
    getMarketLastPrice();
  }, [callPriceHistoryTime, selectedMarket]);

  return (
    last24hOrderPrice && (
      <MarkPriceComponent
        markPrice={markPrice}
        last24hOrderPrice={last24hOrderPrice}
        currency={baseCurrency}
      />
    )
  );
}

const PricePercentComponet = React.memo(({ orgPrice, newPrice }) => {
  if (!orgPrice || !newPrice || orgPrice <= 0) {
    return null;
  }

  const percent = get24hPricePercent({ orgPrice, newPrice });
  let percentColor = percent > 0 ? '#26A69A' : '#F6465D';
  if (percent === 0.0) {
    percentColor = '#FFFFFF';
  }
  return (
    <span
      style={{ marginLeft: '5px', marginRight: '5px', color: percentColor }}
    >
      {percent > 0 ? '+' : ''}
      {percent.toFixed(2)}%
    </span>
  );
});

const MarkPriceComponent = React.memo(
  ({ theme, markPrice, last24hOrderPrice, currency }) => {
    const { market, quoteCurrency } = useMarket();
    const { t: trText } = useTranslation();

    let markPriceColor = '#FFFFFF';
    const tickSize =
      currency.standardType === 'USD'
        ? market?.tickSize && getDecimalCount(market.tickSize)
        : 0;
    const selectQuoteCurrency =
      currency.standardType === 'USD' ? quoteCurrency : currency.standardType;
    let formattedMarkPrice =
      markPrice &&
      market?.tickSize &&
      markPrice.toFixed(getDecimalCount(market.tickSize));
    let intervalPrice = 0;
    let intervalPriceBuf = 0;
    if (markPrice && last24hOrderPrice) {
      intervalPriceBuf = formattedMarkPrice - last24hOrderPrice;
      intervalPrice = intervalPriceBuf.toFixed(
        getDecimalCount(market.tickSize),
      );

      if (
        Number(markPrice) !== Number(intervalPrice) &&
        last24hOrderPrice < markPrice
      ) {
        markPriceColor = '#26A69A';
      } else if (
        Number(markPrice) !== Number(intervalPrice) &&
        last24hOrderPrice > markPrice
      ) {
        markPriceColor = '#F6465D';
      }
    }

    return (
      <div>
        <div
          style={{
            letterSpacing: '1px',
            marginTop: '20px',
            fontWeight: 'bold',
            lineHeight: '120%',
          }}
        >
          <span style={{ fontSize: '32px', color: markPriceColor }}>{`${
            formattedMarkPrice ?? ''
          }`}</span>
          <span style={{ color: markPriceColor, fontSize: '14px' }}>
            {quoteCurrency ?? ''}
          </span>
        </div>
        {markPrice &&
        last24hOrderPrice &&
        Number(markPrice) !== Number(intervalPrice) ? (
          <div style={{ lineHeight: '120%', marginTop: '3px' }}>
            <span style={{ fontSize: '11px', color: '#666' }}>
              {trText('change_percent')}
            </span>
            <PricePercentComponet
              orgPrice={last24hOrderPrice}
              newPrice={markPrice}
            />
            <span style={{ color: markPriceColor, fontWeight: 'bold' }}>
              {last24hOrderPrice < markPrice && (
                <ArrowUpOutlined style={{ marginRight: 5, fontSize: '15px' }} />
              )}
              {last24hOrderPrice > markPrice && (
                <ArrowDownOutlined
                  style={{ marginRight: 5, fontSize: '15px' }}
                />
              )}
              {intervalPrice}
            </span>
          </div>
        ) : null}
      </div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps, ['markPrice']),
);
