import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { TokenWhitelabelApp } from '@dexkit/core/types';
import { Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

export interface TokensTableMenuProps {
  anchorEl: HTMLElement | null;
  token?: TokenWhitelabelApp;
  onClose: () => void;
  appUrl?: string;
}

export default function TokensTableMenu({
  anchorEl,
  onClose,
  token,
  appUrl,
}: TokensTableMenuProps) {
  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        'aria-labelledby': 'long-button',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem
        key={1}
        onClick={onClose}
        component={Link}
        href={`${appUrl}/token/buy/${NETWORK_SLUG(
          token?.chainId,
        )}/${token?.symbol}`}
        target="_blank"
      >
        <FormattedMessage
          id={'buy.token?.page'}
          defaultMessage={'Buy token page'}
        />
      </MenuItem>
      <MenuItem
        key={2}
        onClick={onClose}
        component={Link}
        href={`${appUrl}/token/sell/${NETWORK_SLUG(
          token?.chainId,
        )}/${token?.symbol}`}
        target="_blank"
      >
        <FormattedMessage
          id={'sell.token?.page'}
          defaultMessage={'Sell token page'}
        />
      </MenuItem>
      <MenuItem
        key={3}
        onClick={onClose}
        component={Link}
        href={`${appUrl}/token/${NETWORK_SLUG(
          token?.chainId,
        )}/${token?.symbol}`}
        target="_blank"
      >
        <FormattedMessage
          id={'trade.token?.page'}
          defaultMessage={'Trade token page'}
        />
      </MenuItem>
    </Menu>
  );
}
