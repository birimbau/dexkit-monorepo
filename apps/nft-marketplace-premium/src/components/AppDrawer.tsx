import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';

import { useAuthUserQuery } from '@/modules/user/hooks';
import { useIsMobile } from '@dexkit/core';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Language from '@mui/icons-material/Language';
import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { FormattedMessage } from 'react-intl';
import { useCurrency } from 'src/hooks/currency';
import { AppConfig } from 'src/types/config';
import { useConnectWalletDialog, useLocale } from '../hooks/app';

import MenuIcon from '@mui/icons-material/Menu';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {
  isMiniSidebarAtom,
  showSelectCurrencyAtom,
  showSelectLocaleAtom,
} from '../state/atoms';
import AppDefaultMenuList from './AppDefaultMenuList';
import DrawerMenu from './DrawerMenu';
import Wallet from './icons/Wallet';
import { ThemeModeSelector } from './ThemeModeSelector';
import WalletContent from './WalletContent';

const CustomListItemSecondaryAction = styled(ListItemSecondaryAction)({
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'center',
  height: '100%',
});

interface Props {
  open: boolean;
  onClose: () => void;
  appConfig?: AppConfig;
}

function AppDrawer({ open, onClose, appConfig }: Props) {
  const { isActive, chainId, connector } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => {
    onClose();
    connectWalletDialog.setOpen(true);
  };

  const { locale } = useLocale();
  const currency = useCurrency();

  const setShowShowSelectCurrency = useUpdateAtom(showSelectCurrencyAtom);

  const setShowShowSelectLocale = useUpdateAtom(showSelectLocaleAtom);

  const handleShowSelectCurrencyDialog = () => {
    setShowShowSelectCurrency(true);
  };

  const handleShowSelectLocaleDialog = () => {
    setShowShowSelectLocale(true);
  };

  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  const isMobile = useIsMobile();

  const isSidebar = appConfig?.menuSettings?.layout?.type === 'sidebar';
  const isMini =
    isSidebar && appConfig?.menuSettings?.layout?.variant === 'mini';

  const [isMiniSidebar, setIsMiniSidebar] = useAtom(isMiniSidebarAtom);

  const handleToggleMini = () => {
    setIsMiniSidebar((value) => !value);
  };

  const renderContent = () => {
    return (
      <Box
        sx={(theme) => ({
          display: 'block',
          width:
            !isMobile && (isMini || isMiniSidebar)
              ? 'auto'
              : `${theme.breakpoints.values.sm / 2}px`,
        })}
      >
        <Stack
          direction="row"
          justifyContent={isMiniSidebar || isMini ? 'center' : 'flex-start'}
          px={1}
          py={1}
        >
          <IconButton onClick={handleToggleMini}>
            {isMiniSidebar ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Stack>
        {isMobile && (
          <Box>
            {!isActive ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleConnectWallet}
                startIcon={<Wallet />}
                endIcon={<ChevronRightIcon />}
                fullWidth
              >
                <FormattedMessage
                  id="connect.wallet"
                  defaultMessage="Connect Wallet"
                  description="Connect wallet button"
                />
              </Button>
            ) : (
              <Stack spacing={2}>
                {user && (
                  <>
                    <Box>
                      <Stack direction="row">
                        <Avatar src={user?.profileImageURL} />
                        <Box>
                          <Typography variant="body1">
                            {user?.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Divider />
                  </>
                )}

                {isMobile && <WalletContent />}
              </Stack>
            )}
          </Box>
        )}

        {appConfig?.menuTree ? (
          <DrawerMenu
            menu={appConfig?.menuTree}
            onClose={onClose}
            isMini={!isMobile && (isMini || isMiniSidebar)}
          />
        ) : (
          <AppDefaultMenuList onClose={onClose} />
        )}
        {isMobile && (
          <List
            disablePadding
            subheader={
              <>
                <ListSubheader disableSticky component="div">
                  <FormattedMessage id="settings" defaultMessage="Settings" />
                </ListSubheader>
                <Divider />
              </>
            }
          >
            <ListItemButton divider onClick={handleShowSelectLocaleDialog}>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage id="language" defaultMessage="Language" />
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {locale}
                  </Typography>
                }
              />
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider onClick={handleShowSelectCurrencyDialog}>
              <ListItemIcon>
                <AttachMoney />
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage id="currency" defaultMessage="Currency" />
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {currency.toUpperCase()}
                  </Typography>
                }
              />
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemIcon />
              <ListItemText primary={<ThemeModeSelector />} />
            </ListItemButton>
          </List>
        )}
      </Box>
    );
  };

  if (!isMobile && appConfig?.menuSettings?.layout?.type === 'sidebar') {
    return (
      <Paper sx={{ display: 'block' }} square variant="elevation">
        {renderContent()}
      </Paper>
    );
  }

  return (
    <Drawer PaperProps={{ variant: 'elevation' }} open={open} onClose={onClose}>
      {renderContent()}
    </Drawer>
  );
}

export default AppDrawer;
