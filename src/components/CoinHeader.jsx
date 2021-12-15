import { Col, Row, Divider, Span, Avatar } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useMarket,
  useOrderbook,
  useMarkPrice,
  useSelectedTokenAccounts,
  MarketProvider,
  getTradePageUrl,
} from '../utils/markets';
import { isEqual, getDecimalCount } from '../utils/utils';
import { useInterval } from '../utils/useInterval';
import FloatingElement from './layout/FloatingElement';
import usePrevious from '../utils/usePrevious';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CaretDownFilled,
} from '@ant-design/icons';
import StandaloneBalancesDisplay from './StandaloneBalancesDisplay';
import { MarketSelector } from '../pages/TradePage';
import { getMarketInfos } from '../utils/markets';
import shroomz from '../assets/shroomz.png';

const Title = styled.div`
  color: rgba(255, 255, 255, 1);
`;

const CoinInfo = styled.div`
  padding: 0px 0 0px;
  font-weight: 700;
  ${(props) =>
    props['data-width'] &&
    css`
      width: ${props['data-width']};
    `}
  ${(props) =>
    props['data-bgcolor'] &&
    css`
      background-color: ${props['data-bgcolor']};
    `}
`;

const MarkPriceTitle = styled(Row)`
  padding: 20px 0 14px;
  font-weight: 700;
`;

export default function CoinHeader() {
  const markPrice = useMarkPrice();
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const previousMarkPrice = usePrevious(markPrice);
  let markPriceColor =
    markPrice > previousMarkPrice
      ? '#41C77A'
      : markPrice < previousMarkPrice
      ? '#F23B69'
      : 'white';
  let formattedMarkPrice =
    markPrice &&
    market?.tickSize &&
    markPrice.toFixed(getDecimalCount(market.tickSize));

  return (
    <FloatingElement style={{ height: '10vh' }}>
      <CoinInfo>
        <Row
          gutter={16}
          style={{
            fontWeight: 'bold',
            fontSize: '20px',
            fontFamily: 'Noto Sans KR,sans-serif',
          }}
        >
          <Col className="gutter-row" span={6}>
            <div>
              <Avatar
                style={{ marginRight: '5px', marginBottom: '3px' }}
                src={shroomz}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div> {baseCurrency}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div> Last Price:</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={{ color: markPriceColor }}>
              {' '}
              {formattedMarkPrice || '----'}
              {markPrice > previousMarkPrice && (
                <ArrowUpOutlined style={{ marginRight: 5 }} />
              )}
              {markPrice < previousMarkPrice && (
                <ArrowDownOutlined style={{ marginRight: 5 }} />
              )}
              {quoteCurrency}
            </div>
          </Col>
        </Row>
      </CoinInfo>
    </FloatingElement>
  );
}
