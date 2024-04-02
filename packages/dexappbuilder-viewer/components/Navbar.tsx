import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  NoSsr,
  Popover,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { AttachMoney, Language } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import { FormattedMessage } from "react-intl";

import Link from "@dexkit/ui/components/AppLink";

import Notification from "@dexkit/ui/components/icons/Notification";
import Wallet from "@dexkit/ui/components/icons/Wallet";

import { NETWORK_IMAGE, NETWORK_NAME } from "@dexkit/core/constants/networks";

import {
  useConnectWalletDialog,
  useDexKitContext,
  useDrawerIsOpen,
  useLocale,
  useNotifications,
  useSelectNetworkDialog,
  useShowAppTransactions,
  useShowSelectCurrency,
  useShowSelectLocale,
  useThemeMode,
} from "@dexkit/ui";
import MagicNetworkSelect from "@dexkit/ui/components/MagicNetworkSelect";

import NotificationsDialog from "@dexkit/ui/components/dialogs/NotificationsDialog";
import SelectNetworkDialog from "@dexkit/ui/components/dialogs/SelectNetworkDialog";
import { ThemeMode } from "@dexkit/ui/constants/enum";
import { useCurrency } from "@dexkit/ui/hooks/currency";

import { WalletButton } from "@dexkit/ui/components/WalletButton";
import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { MagicConnector } from "@dexkit/wallet-connectors/connectors/magic";
import NavbarMenu from "./Menu";
import { ThemeModeSelector } from "./ThemeModeSelector";

interface Props {
  appConfig: AppConfig;
  isPreview?: boolean;
}

function Navbar({ appConfig, isPreview }: Props) {
  const { isActive, chainId, connector } = useWeb3React();
  const { mode } = useThemeMode();

  const buttonRef = useRef<HTMLElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [anchorMenuEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorMenuEl);

  const connectWalletDialog = useConnectWalletDialog();

  const selectNetworkDialog = useSelectNetworkDialog();

  const handleCloseSelectNetworkDialog = () => {
    selectNetworkDialog.setIsOpen(false);
  };

  const handleOpenSelectNetworkDialog = () => {
    selectNetworkDialog.setIsOpen(true);
  };

  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const showSelectCurrency = useShowSelectCurrency();

  const showSelectLocale = useShowSelectLocale();

  const showAppTransactions = useShowAppTransactions();

  const handleOpenTransactions = () => showAppTransactions.setIsOpen(true);

  const isDrawerOpen = useDrawerIsOpen();

  const handleToggleDrawer = () => isDrawerOpen.setIsOpen((value) => !value);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSettingsMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleSettingsMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleShowSelectCurrencyDialog = () => {
    showSelectCurrency.setIsOpen(true);
    handleSettingsMenuClose();
  };

  const handleShowSelectLocaleDialog = () => {
    showSelectLocale.setIsOpen(true);
    handleSettingsMenuClose();
  };

  const { currency } = useCurrency();

  const { locale } = useLocale();

  const {
    notifications,
    checkAllNotifications,
    transactions,
    clearNotifications,
    notificationTypes,
  } = useDexKitContext();

  const { filteredUncheckedTransactions, hasPendingTransactions } =
    useNotifications();

  const handleCloseNotifications = () => {
    checkAllNotifications();
    showAppTransactions.setIsOpen(false);
  };

  const handleClearNotifications = () => {
    clearNotifications();
  };

  return (
    <>
      <Menu
        id="settings-menu"
        anchorEl={anchorMenuEl}
        open={openMenu}
        onClose={handleSettingsMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleShowSelectLocaleDialog}>
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
        </MenuItem>
        <MenuItem onClick={handleShowSelectCurrencyDialog}>
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
        </MenuItem>
        <MenuItem>
          <ThemeModeSelector />
        </MenuItem>
      </Menu>
      {/* <AppTransactionsDialog
        dialogProps={{
          maxWidth: 'sm',
          open: showTransactions,
          fullWidth: true,
          onClose: handleCloseNotifications,
        }}
      /> */}
      <NotificationsDialog
        DialogProps={{
          maxWidth: "sm",
          open: showAppTransactions.isOpen,
          fullWidth: true,
          onClose: handleCloseNotifications,
        }}
        notificationTypes={notificationTypes}
        transactions={transactions}
        notifications={notifications}
        onClear={handleClearNotifications}
      />
      <SelectNetworkDialog
        dialogProps={{
          maxWidth: "sm",
          open: selectNetworkDialog.isOpen,
          fullWidth: true,
          onClose: handleCloseSelectNetworkDialog,
        }}
      />
      <Popover
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorEl={buttonRef.current}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <Divider />
        <List disablePadding>
          <ListItem component={Link} href={isPreview ? "#" : "/wallet"}>
            <ListItemIcon>
              <Wallet />
            </ListItemIcon>
            <ListItemText
              primary={<FormattedMessage id="wallet" defaultMessage="Wallet" />}
            />
          </ListItem>
          {/* <ListItem button onClick={handleDisconnect}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Disconnect" />
          </ListItem> */}
        </List>
      </Popover>
      <AppBar
        variant="elevation"
        color="default"
        position="sticky"
        sx={{ zIndex: 10 }}
      >
        <Toolbar variant="dense" sx={{ py: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleToggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}
          {appConfig.logoDark &&
          appConfig.logoDark?.url &&
          mode === ThemeMode.dark ? (
            <Link href={isPreview ? "#" : "/"}>
              <Image
                src={appConfig?.logoDark?.url || ""}
                alt={appConfig.name}
                title={appConfig.name}
                width={
                  isMobile && appConfig?.logoDark?.widthMobile
                    ? appConfig?.logoDark?.widthMobile
                    : appConfig?.logoDark?.width ||
                      appConfig?.logo?.width ||
                      theme.spacing(6)
                }
                height={
                  isMobile && appConfig?.logoDark?.heightMobile
                    ? appConfig?.logoDark?.heightMobile
                    : appConfig?.logoDark?.height ||
                      appConfig?.logo?.height ||
                      theme.spacing(6)
                }
              />
            </Link>
          ) : appConfig?.logo ? (
            <Link href={isPreview ? "#" : "/"}>
              <Image
                src={appConfig?.logo.url}
                alt={appConfig.name}
                title={appConfig.name}
                width={
                  isMobile && appConfig?.logo?.widthMobile
                    ? appConfig?.logo?.widthMobile
                    : appConfig?.logo?.width || theme.spacing(6)
                }
                height={
                  isMobile && appConfig?.logo?.heightMobile
                    ? appConfig?.logo?.heightMobile
                    : appConfig?.logo?.height || theme.spacing(6)
                }
              />
            </Link>
          ) : (
            <Link
              sx={{ textDecoration: "none" }}
              variant="h6"
              color="primary"
              href={isPreview ? "#" : "/"}
            >
              {appConfig.name}
            </Link>
          )}

          <Stack
            direction="row"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              center: "right",
              justifyContent: "flex-end",
              px: 2,
            }}
            alignItems="center"
            spacing={2}
          >
            {appConfig.menuTree ? (
              <Stack
                direction="row"
                sx={{
                  center: "right",
                  justifyContent: "flex-end",
                }}
                alignItems="center"
                spacing={2}
              >
                {appConfig.menuTree.map((m, key) =>
                  m.children ? (
                    <NavbarMenu menu={m} key={key} isPreview={isPreview} />
                  ) : (
                    <Link
                      color="inherit"
                      href={isPreview ? "#" : m.href || "/"}
                      sx={{ fontWeight: 600, textDecoration: "none" }}
                      key={key}
                    >
                      <FormattedMessage
                        id={m.name.toLowerCase()}
                        defaultMessage={m.name}
                      />
                    </Link>
                  )
                )}
              </Stack>
            ) : (
              <Stack
                direction="row"
                sx={{
                  center: "right",
                  justifyContent: "flex-end",
                }}
                alignItems="center"
                spacing={2}
              >
                <Link
                  color="inherit"
                  href={isPreview ? "#" : "/"}
                  sx={{ fontWeight: 600, textDecoration: "none" }}
                >
                  <FormattedMessage id="home" defaultMessage="Home" />
                </Link>
                <Link
                  color="inherit"
                  href={isPreview ? "#" : "/swap"}
                  sx={{ fontWeight: 600, textDecoration: "none" }}
                >
                  <FormattedMessage id="swap" defaultMessage="Swap" />
                </Link>
                {isActive && (
                  <Link
                    color="inherit"
                    href={isPreview ? "#" : "/wallet"}
                    sx={{ fontWeight: 600, textDecoration: "none" }}
                  >
                    <FormattedMessage id="wallet" defaultMessage="Wallet" />
                  </Link>
                )}
              </Stack>
            )}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              alignContent="center"
            >
              {/* <Button variant="outlined" color="primary">
                Buy ETH
              </Button> */}

              {false && (
                <ButtonBase
                  onClick={handleOpenSelectNetworkDialog}
                  sx={(theme) => ({
                    px: 2,
                    py: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.spacing(1),
                  })}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={NETWORK_IMAGE(chainId)}
                      sx={(theme) => ({
                        width: "auto",
                        height: theme.spacing(2),
                      })}
                      alt={NETWORK_NAME(chainId) || ""}
                    />
                    <Typography variant="body1">
                      {NETWORK_NAME(chainId)}
                    </Typography>
                    <KeyboardArrowDownIcon />
                  </Stack>
                </ButtonBase>
              )}

              {!isActive ? (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleOpenConnectWalletDialog}
                  startIcon={<Wallet />}
                  endIcon={<ChevronRightIcon />}
                >
                  <FormattedMessage
                    id="connect.wallet"
                    defaultMessage="Connect Wallet"
                    description="Connect wallet button"
                  />
                </Button>
              ) : (
                <Stack direction="row" alignItems="center" spacing={2}>
                  {connector instanceof MagicConnector && (
                    <MagicNetworkSelect />
                  )}
                  <WalletButton />

                  <NoSsr>
                    <IconButton onClick={handleOpenTransactions}>
                      <Badge
                        variant={
                          hasPendingTransactions &&
                          filteredUncheckedTransactions.length === 0
                            ? "dot"
                            : "standard"
                        }
                        color="primary"
                        badgeContent={
                          filteredUncheckedTransactions.length > 0
                            ? filteredUncheckedTransactions.length
                            : undefined
                        }
                        invisible={
                          !hasPendingTransactions &&
                          filteredUncheckedTransactions.length === 0
                        }
                      >
                        <Notification />
                      </Badge>
                    </IconButton>
                  </NoSsr>
                </Stack>
              )}
              <IconButton onClick={handleSettingsMenuClick}>
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Box
            sx={{
              display: {
                sm: "none",
                xs: "flex",
                flexGrow: 1,
                justifyContent: "flex-end",
              },
            }}
          >
            <NoSsr>
              <IconButton onClick={handleOpenTransactions}>
                <Badge
                  variant={
                    hasPendingTransactions &&
                    filteredUncheckedTransactions.length === 0
                      ? "dot"
                      : "standard"
                  }
                  color="primary"
                  badgeContent={
                    filteredUncheckedTransactions.length > 0
                      ? filteredUncheckedTransactions.length
                      : undefined
                  }
                  invisible={
                    !hasPendingTransactions &&
                    filteredUncheckedTransactions.length === 0
                  }
                >
                  <Notification />
                </Badge>
              </IconButton>
            </NoSsr>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
