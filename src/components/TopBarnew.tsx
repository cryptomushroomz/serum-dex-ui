import * as React from 'react';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button'
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useWallet } from '../utils/wallet';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import Settings from './Settings';
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import AppSearch from './AppSearch';
import { getTradePageUrl } from '../utils/markets';
import { useCallback, useEffect, useState } from 'react';
import MenuList from '@mui/material/MenuList';
import LinkAddress from './LinkAddress';
import { Row } from 'antd';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const [anchorE2, setAnchorE2] = React.useState(null);
  const [mobileMoreAnchorE2, setMobileMoreAnchorE2] = React.useState(null);

  const open = Boolean(anchorE2);

  const handleClick = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorE2(null);
  };

  const { connected, wallet, select, connect, disconnect } = useWallet();
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={connected ? disconnect : connect}>{connected ? 'Disconnect' : 'Connect'}</MenuItem>
      <MenuItem onClick={select}>Switch Wallet</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Button variant="contained">Connect</Button>
        </IconButton>
        
      </MenuItem>
    </Menu>
  );
  

  const EXTERNAL_LINKS = {
    '/swap': 'https://swap.cryptomushroomz.io',
  };

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

 
  const handlepath = useCallback(
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

  const tradePageUrl = location.pathname.startsWith('/market/E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA/')
    ? location.pathname
    : getTradePageUrl();

  

  return (
    
    <ThemeProvider theme={darkTheme}>
    
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
         
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'flex', sm: 'block' } }}
          >
            <img src={logo} alt="" style={{height: "50px "}} />
          </Typography>
         
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
         
            <MenuList>
          <Row>
            <MenuItem>
              <Button variant="text" onClick={() => history.push('/market/E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA')}>
                TRADE

            </Button>
            

              </MenuItem>
              <MenuItem>
              <Button variant="text" onClick={() => history.push('/market/E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA')}>
                SWAP

            </Button>
            

              </MenuItem>
              
            
            {connected && (!searchFocussed || location.pathname === '/balances') && (
              <MenuItem>
              <Button variant="text" onClick={() => history.push('/balances')}>
                BALANCES

            </Button>
            

              </MenuItem>
            )}
            {connected && (!searchFocussed || location.pathname === '/orders') && (
              <MenuItem>
              <Button variant="text" onClick={() => history.push('/orders')}>
                ORDERS

            </Button>
            

              </MenuItem>
            )}</Row> 
            </MenuList>
            </Box>
            <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Button variant="contained">{connected ? 'Disconnect' : 'Connect'}</Button>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
    </ThemeProvider>
  );
}
