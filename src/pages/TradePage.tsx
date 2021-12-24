import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Popover, Row, Select, Typography } from 'antd';
import styled from 'styled-components';
import Orderbook from '../components/Orderbook';
import UserInfoTable from '../components/UserInfoTable';
import StandaloneBalancesDisplay from '../components/StandaloneBalancesDisplay';
import {
  getMarketInfos,
  getTradePageUrl,
  MarketProvider,
  useMarket,
  useMarketInfos,
  useMarketsList,
  useMarkPrice,
  useSelectedBaseCurrencyAccount,
  getMarketOrderPrice,
  USE_MARKETS,
} from '../utils/markets';
import TradeForm from '../components/TradeForm';
import TradesTable from '../components/TradesTable';
import LinkAddress from '../components/LinkAddress';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomMarketDialog from '../components/CustomMarketDialog';
import { notify } from '../utils/notifications';
import { useHistory, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import CoinHeader from '../components/CoinHeadernew';

import { TVChartContainer } from '../components/TradingView';
import { Market } from '@project-serum/serum';
import { basename } from 'path';
import MarketSelect from '../components/Marketselect';
// Use following stub for quick setup without the TradingView private dependency
// function TVChartContainer() {
//   return <></>
// }



const { Option, OptGroup } = Select;


const Wrapper = styled.div`
  background-color: #000000;  
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;


export default function TradePage() {
  let { marketAddress } = useParams();
  if (marketAddress != "shroomzdex"){
    marketAddress = "E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA"
  }

  useEffect(() => {
    if (marketAddress) {
      localStorage.setItem('marketAddress', JSON.stringify(marketAddress));
    }
  }, [marketAddress]);
  const history = useHistory();
  function setMarketAddress(address) {
    history.push(getTradePageUrl(address));
  }

  return (
    <MarketProvider
      marketAddress={marketAddress}
      setMarketAddress={setMarketAddress}
    >

      <TradePageInner />
    </MarketProvider>
  );
}

export function TradePageInner() {
  const {
    market,
    marketName,
    customMarkets,
    setCustomMarkets,
    setMarketAddress,
  } = useMarket();
  const markets = useMarketsList();
  const [handleDeprecated, setHandleDeprecated] = useState(false);
  const [addMarketVisible, setAddMarketVisible] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    document.title = marketName ? `${marketName} — SHROOMZDEX` : 'SHROOMZDEX';
  }, [marketName]);

  const changeOrderRef = useRef<
    ({ size, price }: { size?: number; price?: number }) => void
  >();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = dimensions?.width;
  const componentProps = {
    onChangeOrderRef: (ref) => (changeOrderRef.current = ref),
    onPrice: useCallback(
      (price) => changeOrderRef.current && changeOrderRef.current({ price }),
      [],
    ),
    onSize: useCallback(
      (size) => changeOrderRef.current && changeOrderRef.current({ size }),
      [],
    ),
  };
  const component = (() => {
    if (handleDeprecated) {
      return null;
    } else if (width < 1000) {
      return <RenderSmaller {...componentProps} />;
    } else if (width < 1450) {
      return <RenderSmall {...componentProps} />;
    } else {
      return <RenderNormal {...componentProps} />;
    }
  })();

  const onAddCustomMarket = (customMarket) => {
    const marketInfo = getMarketInfos(customMarkets).some(
      (m) => m.address.toBase58() === customMarket.address,
    );
    if (marketInfo) {
      notify({
        message: `A market with the given ID already exists`,
        type: 'error',
      });
      return;
    }
    const newCustomMarkets = [...customMarkets, customMarket];
    setCustomMarkets(newCustomMarkets);
    setMarketAddress(customMarket.address);
  };

  const onDeleteCustomMarket = (address) => {
    const newCustomMarkets = customMarkets.filter((m) => m.address !== address);
    setCustomMarkets(newCustomMarkets);
  };

  return (
    <>
      <CustomMarketDialog
        visible={addMarketVisible}
        onClose={() => setAddMarketVisible(false)}
        onAddCustomMarket={onAddCustomMarket}    
      />
      <Wrapper>
        <Row
          align="middle"
          style={{ paddingLeft: 5, paddingRight: 5 }}
          gutter={16}
        > 
          
          <Col>
            <MarketSelector
              markets={markets}
              setHandleDeprecated={setHandleDeprecated}
              placeholder={'Select market'}
              customMarkets={customMarkets}
              onDeleteCustomMarket={onDeleteCustomMarket}
            />
          </Col>
                    {market ? (
            <Col>
              <Popover
                content={<LinkAddress address={market.publicKey.toBase58()} />}
                placement="bottomRight"
                title="Market address"
                trigger="click"
              >
                <InfoCircleOutlined style={{ color: '#ebae37' }} />
              </Popover>
            </Col>
          ) : null}
          <Col>
            <PlusCircleOutlined
              style={{ color: '#ebae37' }}
              onClick={() => setAddMarketVisible(true)}
            />
          </Col>
        </Row>
        {component}
      </Wrapper>
    </>
  );
}

export function MarketSelector({
  markets,
  placeholder,
  setHandleDeprecated,
  customMarkets,
  onDeleteCustomMarket,
}) {
  const { market, setMarketAddress } = useMarket();

  const onSetMarketAddress = (marketAddress) => {
    setHandleDeprecated(false);
    setMarketAddress(marketAddress);
  };

  const extractBase = (a) => a.split('/')[0];
  const extractQuote = (a) => a.split('/')[1];

  const selectedMarket = getMarketInfos(customMarkets)
    .find(
      (proposedMarket) =>
        market?.address && proposedMarket.address.equals(market.address),
    )
    ?.address?.toBase58();

  return (
    <Select
      showSearch
      size={'large'}
      style={{ width: 300 }}
      placeholder={placeholder || 'Select a market'}
      optionFilterProp="name"
      onSelect={onSetMarketAddress}
      listHeight={400}
      value={selectedMarket}
      filterOption={(input, option) =>
        option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {customMarkets && customMarkets.length > 0 && (
        <OptGroup label="Custom">
          {customMarkets.map(({ address, name }, i) => (
            <Option
              value={address}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(39, 44, 61)' : null,
              }}
            >
              <Row>
                <Col flex="auto">{name}</Col>
                {selectedMarket !== address && (
                  <Col>
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        onDeleteCustomMarket && onDeleteCustomMarket(address);
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Option>
          ))}
        </OptGroup>
      )}
      <OptGroup label="Markets">
        {markets
          .sort((a, b) =>
            extractQuote(a.name) === 'USDT' && extractQuote(b.name) !== 'USDT'
              ? -1
              : extractQuote(a.name) !== 'USDT' &&
                extractQuote(b.name) === 'USDT'
              ? 1
              : 0,
          )
          .sort((a, b) =>
            extractBase(a.name) < extractBase(b.name)
              ? -1
              : extractBase(a.name) > extractBase(b.name)
              ? 1
              : 0,
          )
          .map(({ address, name, deprecated }, i) => (
            <Option
              value={address.toBase58()}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(39, 44, 61)' : null,
              }}
            >
              {name} {deprecated ? ' (Deprecated)' : null}
            </Option>
          ))}
      </OptGroup>
    </Select>
  );
}

const RenderNormal = ({ onChangeOrderRef, onPrice, onSize }) => {
  return (
    <><Row
      style={{
        flexWrap: 'wrap',
        display: 'flex',
      }}
    >
      <Col style={{ height: '100%', flex: '6', display:'flex', flexFlow: 'column' }}>
         <div style={{ display: 'flexgrow'}}>
        <CoinHeader />
        </div>
        <div style={{ display: 'flex', minHeight: '60vh'}}>
          <TVChartContainer />
        </div>
        <div>
        <UserInfoTable />
        </div>
      </Col>
      <Col style={{ flex: '2', display:'flex', flexFlow: 'column'}}>
        <div style={{display:'flex', flex: '1'}} >
          <Orderbook smallScreen={true}
            depth={9}
            onPrice={onPrice}
            onSize={onSize} />
        </div>
        <div style={{display:'flex', flex: '1'}} >
          <TradesTable />
        </div>
      </Col>
      <Col
        style={{flex: "3", display:'flex', flexFlow: 'column' }}
      > <div style={{display:'flex', flex: '1'}} >
        <TradeForm setChangeOrderRef={onChangeOrderRef} />
        </div>
        <div style={{display:'flex', flex: '1'}} >
        <StandaloneBalancesDisplay />
        </div>
      </Col>
    </Row>
    </>
  );
};

const RenderSmall = ({ onChangeOrderRef, onPrice, onSize }) => {
  return (
<><Row
      style={{
        flexWrap: 'wrap',
        display: 'flex',
      }}
    >
      <Col style={{ height: '100%', flex: '6', display:'flex', flexFlow: 'column' }}>
         <div style={{ display: 'flexgrow'}}>
        <CoinHeader />
        </div>
        <div style={{ display: 'flex', minHeight: '60vh'}}>
          <TVChartContainer />
        </div>
      
      </Col>
      <Col style={{ flex: '2', display:'flex', flexFlow: 'column'}}>
        <div style={{display:'flex', flex: '1'}} >
          <Orderbook smallScreen={true}
            depth={9}
            onPrice={onPrice}
            onSize={onSize} />
        </div>
        <div style={{display:'flex', flex: '1'}} >
          <TradesTable />
        </div>
      </Col>
      <Col
        style={{flex: "3", display:'flex', flexFlow: 'column' }}
      > <div style={{display:'flex', flex: '1'}} >
        <TradeForm setChangeOrderRef={onChangeOrderRef} />
        </div>
        <div style={{display:'flex', flex: '1'}} >
        <StandaloneBalancesDisplay />
        </div>
      </Col>
    </Row>
    <Row>

    <div style={{flex: 'auto'}}>
        <UserInfoTable />
        </div>
    </Row>
    </>
  );
};

const RenderSmaller = ({ onChangeOrderRef, onPrice, onSize }) => {
  return (
    <><Row
      style={{
        flexWrap: 'wrap',
        display: 'flex',
      }}
    >
      <Col style={{ height: '100%', flex: '6', display:'flex', flexFlow: 'column' }}>
         <div style={{ display: 'flexgrow'}}>
        <CoinHeader />
        </div>
        <div style={{ display: 'flex', minHeight: '60vh'}}>
          <TVChartContainer />
        </div>
      
      </Col>
      <Col style={{ flex: '2', display:'flex', flexFlow: 'column'}}>
        <div style={{display:'flex', flex: '1'}} >
          <Orderbook smallScreen={true}
            depth={9}
            onPrice={onPrice}
            onSize={onSize} />
        </div>
        <div style={{display:'flex', flex: '1'}} >
          <TradesTable />
        </div>
      </Col>
      <Col
        style={{flex: "3", display:'flex', flexFlow: 'column' }}
      > <div style={{display:'flex', flex: '1'}} >
        <TradeForm setChangeOrderRef={onChangeOrderRef} />
        </div>
        <div style={{display:'flex', flex: '1'}} >
        <StandaloneBalancesDisplay />
        </div>
      </Col>
    </Row>
    <Row>
    <div style={{flex: 'auto'}}>
        <UserInfoTable />
        </div>
    </Row>
    </>
  );
};

