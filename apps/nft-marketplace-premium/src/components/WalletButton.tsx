import { useAuthUserQuery } from '@/modules/user/hooks';
import { useEvmNativeBalanceQuery } from '@dexkit/core';
import { GET_WALLET_ICON } from '@dexkit/core/connectors';
import {
  copyToClipboard,
  formatBigNumber,
  getChainName,
} from '@dexkit/core/utils';
import FileCopy from '@mui/icons-material/FileCopy';
import Logout from '@mui/icons-material/Logout';
import Send from '@mui/icons-material/Send';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLogoutAccountMutation } from 'src/hooks/account';
import { useConnectWalletDialog } from 'src/hooks/app';
import { isBalancesVisibleAtom } from '../state/atoms';
import {
  getChainLogoImage,
  getChainSymbol,
  truncateAddress,
} from '../utils/blockchain';
import { CopyIconButton } from './CopyIconButton';

import { useEvmCoins } from '@dexkit/ui';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import dynamic from 'next/dynamic';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const EvmReceiveDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/EvmReceiveDialog'),
);

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    ),
);

const SelectNetworkDialog = dynamic(
  () => import('./dialogs/SelectNetworkDialog'),
);

export interface WalletButtonProps {
  align?: 'center' | 'left';
  onSend?: () => void;
  onReceive?: () => void;
}

export function WalletButton({ align }: WalletButtonProps) {
  const router = useRouter();
  const { connector, account, ENSName, provider, chainId } = useWeb3React();
  const logoutMutation = useLogoutAccountMutation();
  const userQuery = useAuthUserQuery();
  const user = userQuery.data;
  const connectWalletDialog = useConnectWalletDialog();
  const handleSwitchWallet = () => {
    connectWalletDialog.setOpen(true);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isBalancesVisible = useAtomValue(isBalancesVisibleAtom);

  const justifyContent = align === 'left' ? 'flex-start' : 'center';

  const handleLogoutWallet = useCallback(() => {
    logoutMutation.mutate();
    if (connector?.deactivate) {
      connector.deactivate();
    } else {
      if (connector?.resetState) {
        connector?.resetState();
      }
    }
  }, [connector]);

  const { data: balance } = useEvmNativeBalanceQuery({ provider, account });

  const formattedBalance = useMemo(() => {
    if (balance) {
      return formatBigNumber(balance);
    }

    return '0.00';
  }, [balance]);

  const handleCopy = () => {
    if (account) {
      copyToClipboard(account);
    }
  };

  const { formatMessage } = useIntl();

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const [isSendOpen, setIsSendOpen] = useState(false);

  const handleOpenSend = () => {
    setIsSendOpen(true);
  };

  const handleCloseSend = () => {
    setIsSendOpen(false);
  };

  const [isOpen, setOpen] = useState(false);

  const handleSwitchNetwork = () => {
    setOpen(true);
  };

  const handleSwitchNetworkClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isOpen && (
        <SelectNetworkDialog
          dialogProps={{
            maxWidth: 'sm',
            open: isOpen,
            fullWidth: true,
            onClose: handleSwitchNetworkClose,
          }}
        />
      )}

      {isSendOpen && (
        <EvmTransferCoinDialog
          dialogProps={{
            open: isSendOpen,
            onClose: handleCloseSend,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            provider: provider,
            coins: evmCoins,
          }}
        />
      )}

      {isReceiveOpen && (
        <EvmReceiveDialog
          dialogProps={{
            open: isReceiveOpen,
            onClose: handleCloseReceive,
            maxWidth: 'sm',
            fullWidth: true,
          }}
          receiver={account}
          chainId={chainId}
          coins={evmCoins}
        />
      )}

      <ButtonBase
        id="wallet-button"
        sx={(theme) => ({
          px: 1,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          justifyContent,
        })}
        onClick={handleClick}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src={GET_WALLET_ICON(connector)}
            sx={(theme) => ({
              width: theme.spacing(5),
              height: theme.spacing(5),
              background: theme.palette.action.hover,
            })}
            variant="rounded"
          />
          <Box>
            <Typography variant="body2" align="left">
              {isBalancesVisible
                ? ENSName
                  ? ENSName
                  : truncateAddress(account)
                : '**********'}
            </Typography>
            <div>
              <Typography
                color="text.secondary"
                variant="caption"
                align="left"
                component="div"
              >
                {isBalancesVisible ? formattedBalance : '*.**'}{' '}
                {getChainSymbol(chainId)}
              </Typography>
            </div>
          </Box>
        </Stack>
      </ButtonBase>
      <Popover
        id="wallet-menuu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 1, py: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  src={GET_WALLET_ICON(connector)}
                  sx={(theme) => ({
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    background: theme.palette.action.hover,
                  })}
                  variant="rounded"
                />
                <Box>
                  <Typography variant="body2" align="left">
                    {isBalancesVisible
                      ? ENSName
                        ? ENSName
                        : truncateAddress(account)
                      : '**********'}{' '}
                    <CopyIconButton
                      iconButtonProps={{
                        onClick: handleCopy,
                        size: 'small',
                      }}
                      tooltip={formatMessage({
                        id: 'copy',
                        defaultMessage: 'Copy',
                        description: 'Copy text',
                      })}
                      activeTooltip={formatMessage({
                        id: 'copied',
                        defaultMessage: 'Copied!',
                        description: 'Copied text',
                      })}
                    >
                      <FileCopy fontSize="inherit" color="inherit" />
                    </CopyIconButton>
                  </Typography>
                  <div>
                    <Typography
                      color="text.secondary"
                      variant="caption"
                      align="left"
                      component="div"
                    >
                      {isBalancesVisible ? formattedBalance : '*.**'}{' '}
                      {getChainSymbol(chainId)}
                    </Typography>
                  </div>
                </Box>
              </Stack>
              <IconButton onClick={handleLogoutWallet}>
                <Logout fontSize="small" />
              </IconButton>
            </Stack>
            <ButtonBase
              sx={{
                display: 'block',
                px: 1,
                py: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: (theme) => theme.spacing(1),
              }}
              onClick={handleSwitchNetwork}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    src={getChainLogoImage(chainId)}
                    sx={{ width: '1rem', height: '1rem' }}
                  />
                  <Typography>{getChainName(chainId)}</Typography>
                </Stack>
                <KeyboardArrowRightIcon />
              </Stack>
            </ButtonBase>
            <Divider />
            <Stack spacing={2} direction="row">
              <Button
                fullWidth
                startIcon={<Send />}
                color="inherit"
                variant="outlined"
                onClick={handleOpenSend}
              >
                <FormattedMessage id="send" defaultMessage="Send" />
              </Button>
              <Button
                startIcon={<VerticalAlignBottomIcon />}
                color="inherit"
                variant="outlined"
                fullWidth
                onClick={handleOpenReceive}
              >
                <FormattedMessage id="receive" defaultMessage="Receive" />
              </Button>
            </Stack>
            <Button
              onClick={handleSwitchWallet}
              startIcon={<SwitchAccountIcon fontSize="small" />}
              variant="outlined"
              color="inherit"
            >
              <FormattedMessage
                id="switch.wallet"
                defaultMessage="Switch wallet"
              />
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
