import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
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
import { useUpdateAtom } from 'jotai/utils';
import { FormattedMessage } from 'react-intl';
import { useCurrency } from 'src/hooks/currency';
import { useAppConfig, useConnectWalletDialog, useLocale } from '../hooks/app';
import { showSelectCurrencyAtom, showSelectLocaleAtom } from '../state/atoms';
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
}

function AppDrawer({ open, onClose }: Props) {
  const { isActive, chainId, connector } = useWeb3React();
  const appConfig = useAppConfig();
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

  const renderContent = () => {
    return (
      <Box
        sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
      >
        <Box sx={{ p: 2 }}>
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

              <WalletContent />
            </Stack>
          )}
        </Box>
        <Divider />
        {appConfig.menuTree ? (
          <DrawerMenu menu={appConfig.menuTree} onClose={onClose} />
        ) : (
          <AppDefaultMenuList onClose={onClose} />
        )}
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
      </Box>
    );
  };

  const isMobile = useIsMobile();

  if (!isMobile && appConfig.menuSettings?.layout?.type === 'sidebar') {
    return (
      <Paper
        square
        variant="elevation"
        sx={{ height: '100vh', overflowY: 'scroll' }}
      >
        {renderContent()}
      </Paper>
    );
  }

  return (
    <Drawer open={open} onClose={onClose}>
      {renderContent()}
    </Drawer>
  );
}

export default AppDrawer;
