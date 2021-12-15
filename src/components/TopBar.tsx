import {
  BorderBottomOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Col, Menu, Popover, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import Settings from './Settings';
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import WalletConnect from './WalletConnect';
import AppSearch from './AppSearch';
import { getTradePageUrl } from '../utils/markets';

const Wrapper = styled.div`
  background-color: #000000;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0px 30px;
  flex-wrap: wrap;
  border-bottom: 2px solid #ebae37;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #ebae37;
  font-weight: bold;
  font-size: 30px;
  cursor: pointer;
  img {
    height: 50px;
    margin-right: 8px;
  }
`;

const EXTERNAL_LINKS = {
  '/swap': 'https://swap.cryptomushroomz.com',
};

export default function TopBar() {
  const { connected, wallet } = useWallet();
  const {
    endpoint,
    endpointInfo,
    setEndpoint,
    availableEndpoints,
    setCustomEndpoints,
  } = useConnectionConfig();
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const [searchFocussed, setSearchFocussed] = useState(false);

  const handleClick = useCallback(
    (e) => {
      if (!(e.key in EXTERNAL_LINKS)) {
        history.push(e.key);
      }
    },
    [history],
  );

  const onAddCustomEndpoint = (info: EndpointInfo) => {
    const existingEndpoint = availableEndpoints.some(
      (e) => e.endpoint === info.endpoint,
    );
    if (existingEndpoint) {
      notify({
        message: `An endpoint with the given url already exists`,
        type: 'error',
      });
      return;
    }

    const handleError = (e) => {
      console.log(`Connection to ${info.endpoint} failed: ${e}`);
      notify({
        message: `Failed to connect to ${info.endpoint}`,
        type: 'error',
      });
    };

    try {
      const connection = new Connection(info.endpoint, 'recent');
      connection
        .getBlockTime(0)
        .then(() => {
          setTestingConnection(true);
          console.log(`testing connection to ${info.endpoint}`);
          const newCustomEndpoints = [
            ...availableEndpoints.filter((e) => e.custom),
            info,
          ];
          setEndpoint(info.endpoint);
          setCustomEndpoints(newCustomEndpoints);
        })
        .catch(handleError);
    } catch (e) {
      handleError(e);
    } finally {
      setTestingConnection(false);
    }
  };

  const endpointInfoCustom = endpointInfo && endpointInfo.custom;
  useEffect(() => {
    const handler = () => {
      if (endpointInfoCustom) {
        setEndpoint(ENDPOINTS[0].endpoint);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [endpointInfoCustom, setEndpoint]);

  const tradePageUrl = location.pathname.startsWith('/market/')
    ? location.pathname
    : getTradePageUrl();

  return (
    <>
      <CustomClusterEndpointDialog
        visible={addEndpointVisible}
        testingConnection={testingConnection}
        onAddCustomEndpoint={onAddCustomEndpoint}
        onClose={() => setAddEndpointVisible(false)}
      />
      <Wrapper>
        <LogoWrapper onClick={() => history.push(tradePageUrl)}>
          <img src={logo} alt="" />

        </LogoWrapper>
        <Menu
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[location.pathname]}
          style={{
            borderBottom: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'flex-end',
            flex: 1,
            fontSize: 20,
          }}
        >
          <Menu.Item key={tradePageUrl} style={{ margin: '0 10px 0 20px', color: '#ec9105' }}>
            TRADE
          </Menu.Item>
          {!searchFocussed && (
            <Menu.Item key="/swap" style={{ margin: '0 10px', color: '#ec9105' }}>
              <a
                href={EXTERNAL_LINKS['/swap']}
                target="_blank"
                rel="noopener noreferrer"
              >
                SWAP
              </a>
            </Menu.Item>
          )}
          {connected && (!searchFocussed || location.pathname === '/balances') && (
            <Menu.Item key="/balances" style={{ margin: '0 10px' }}>
              BALANCES
            </Menu.Item>
          )}
          {connected && (!searchFocussed || location.pathname === '/orders') && (
            <Menu.Item key="/orders" style={{ margin: '0 10px' }}>
              ORDERS
            </Menu.Item>
          )}
          
          
            
        </Menu>
        
       
        {connected && (
          <div>
            <Popover
              content={<Settings autoApprove={wallet?.autoApprove} />}
              placement="bottomRight"
              title="Settings"
              trigger="click"
            >
              <Button style={{ marginRight: 8}} type="default" shape= "round" >
                <SettingOutlined />
                Settings
              </Button>
            </Popover>
          </div>
        )}
        <div>
          <WalletConnect />
        </div>
      </Wrapper>
    </>
  );
}
