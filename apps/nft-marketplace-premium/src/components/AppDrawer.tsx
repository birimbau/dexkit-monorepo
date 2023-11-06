import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Stack,
  styled,
  Typography,
} from '@mui/material';

import { useAuthUserQuery } from '@/modules/user/hooks';
import AttachMoney from '@mui/icons-material/AttachMoney';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Language from '@mui/icons-material/Language';
import { useWeb3React } from '@web3-react/core';
import { useUpdateAtom } from 'jotai/utils';
import { FormattedMessage } from 'react-intl';
import { useCurrency } from 'src/hooks/currency';
import { useAppConfig, useConnectWalletDialog, useLocale } from '../hooks/app';
import { showSelectCurrencyAtom, showSelectLocaleAtom } from '../state/atoms';
import DrawerMenu from './DrawerMenu';
import Wallet from './icons/Wallet';
import Link from './Link';
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

  return (
    <Drawer open={open} onClose={onClose}>
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
          <List disablePadding>
            <ListItem
              divider
              onClick={onClose}
              component={Link}
              href="/"
              button
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ fontWeight: 600 }}
                primary={<FormattedMessage id="home" defaultMessage="Home" />}
              />
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItem>
            <ListItem
              divider
              onClick={onClose}
              component={Link}
              href="/swap"
              button
            >
              <ListItemIcon>
                <SwapVertOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ fontWeight: 600 }}
                primary={<FormattedMessage id="swap" defaultMessage="Swap" />}
              />
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItem>
            <ListItem
              divider
              onClick={onClose}
              component={Link}
              href="/wallet"
              button
            >
              <ListItemIcon>
                <Wallet />
              </ListItemIcon>
              <ListItemText
                sx={{ fontWeight: 600 }}
                primary={
                  <FormattedMessage id="wallet" defaultMessage="Wallet" />
                }
              />
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItem>
          </List>
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
          <ListItem divider onClick={handleShowSelectLocaleDialog}>
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
          </ListItem>
          <ListItem divider onClick={handleShowSelectCurrencyDialog}>
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
          </ListItem>
          <ListItem divider>
            <ListItemIcon />

            <ListItemText primary={<ThemeModeSelector />} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default AppDrawer;
