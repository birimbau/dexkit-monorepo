import { useEvmNativeBalanceQuery } from '@dexkit/core';
import { GET_WALLET_ICON } from '@dexkit/core/connectors';
import { formatBigNumber } from '@dexkit/core/utils';
import {
  Avatar,
  Box,
  ButtonBase,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { isBalancesVisibleAtom } from '../state/atoms';
import { getChainSymbol, truncateAddress } from '../utils/blockchain';

import WalletContent from './WalletContent';

export interface WalletButtonProps {
  align?: 'center' | 'left';
  onSend?: () => void;
  onReceive?: () => void;
}

export function WalletButton({ align }: WalletButtonProps) {
  const { connector, account, ENSName, provider, chainId } = useWeb3React();

  const isBalancesVisible = useAtomValue(isBalancesVisibleAtom);

  const justifyContent = align === 'left' ? 'flex-start' : 'center';

  const { data: balance } = useEvmNativeBalanceQuery({ provider, account });

  const formattedBalance = useMemo(() => {
    if (balance) {
      return formatBigNumber(balance);
    }

    return '0.00';
  }, [balance]);

  const [showContent, setShowContent] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setShowContent(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowContent(false);
  };

  return (
    <>
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
              width: theme.spacing(4),
              height: theme.spacing(4),
              background: theme.palette.action.hover,
            })}
            variant="rounded"
          />
          <Box>
            <Typography variant="caption" align="left" component="div">
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
        open={showContent}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={handleClose}
      >
        <WalletContent />
      </Popover>
    </>
  );
}
