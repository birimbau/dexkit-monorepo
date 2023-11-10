import { useEvmNativeBalanceQuery } from '@dexkit/core';
import { AccountBalance } from '@dexkit/ui/components/AccountBalance';
import { GET_WALLET_ICON } from '@dexkit/wallet-connectors/connectors';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { isBalancesVisibleAtom } from '../state/atoms';
import { truncateAddress } from '../utils/blockchain';

const WalletContent = dynamic(() => import('./WalletContent'));

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
              width: theme.spacing(2),
              height: theme.spacing(2),
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
              {false && (
                <AccountBalance isBalancesVisible={isBalancesVisible} />
              )}
            </div>
          </Box>
          {showContent ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Stack>
      </ButtonBase>
      {showContent && (
        <Popover
          open={showContent}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={handleClose}
        >
          <WalletContent />
        </Popover>
      )}
    </>
  );
}
