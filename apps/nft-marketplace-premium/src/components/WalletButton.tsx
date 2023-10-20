import { useAuthUserQuery } from '@/modules/user/hooks';
import { GET_WALLET_ICON } from '@dexkit/wallet-connectors/connectors';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {
  Avatar,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLogoutAccountMutation } from 'src/hooks/account';
import { useConnectWalletDialog } from 'src/hooks/app';
import { isBalancesVisibleAtom } from '../state/atoms';
import { truncateAddress } from '../utils/blockchain';
interface Props {
  align?: 'center' | 'left';
}

export function WalletButton(props: Props) {
  const { align } = props;
  const router = useRouter();
  const { connector, account, ENSName } = useWeb3React();
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

  return (
    <>
      <ButtonBase
        id="wallet-button"
        sx={(theme) => ({
          px: 2,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          justifyContent,
        })}
        onClick={handleClick}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {user?.profileImageURL && (
            <Avatar
              src={user?.profileImageURL}
              sx={(theme) => ({
                width: theme.spacing(2),
                height: theme.spacing(2),
              })}
            />
          )}
          <Avatar
            src={GET_WALLET_ICON(connector)}
            sx={(theme) => ({
              width: theme.spacing(2),
              height: theme.spacing(2),
            })}
          />
          <Typography variant="body1">
            {isBalancesVisible
              ? ENSName
                ? ENSName
                : truncateAddress(account)
              : '**********'}
          </Typography>
          <ExpandMoreIcon />
        </Stack>
      </ButtonBase>
      <Menu
        id="wallet-menuu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() =>
            user ? router.push(`/u/${user.username}`) : router.push(`/u/login`)
          }
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="view.profile" defaultMessage="View profile" />
        </MenuItem>
        {user && (
          <MenuItem onClick={() => router.push(`/u/edit`)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <FormattedMessage id="edit.profile" defaultMessage="Edit profile" />
          </MenuItem>
        )}
        <MenuItem onClick={handleSwitchWallet}>
          <ListItemIcon>
            <SwitchAccountIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="switch.wallet" defaultMessage="Switch wallet" />
        </MenuItem>
        <MenuItem onClick={handleLogoutWallet}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="logout.wallet" defaultMessage="Logout wallet" />
        </MenuItem>
      </Menu>
    </>
  );
}
