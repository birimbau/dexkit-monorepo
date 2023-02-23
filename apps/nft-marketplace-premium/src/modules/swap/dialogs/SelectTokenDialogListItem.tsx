import {
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@mui/material';

import { formatUnits } from 'ethers/lib/utils';
import { ChainId } from '../../../constants/enum';
import { TokenBalance } from '../../../types/blockchain';
import { TOKEN_ICON_URL } from '../../../utils/token';

interface Props {
  chainId: ChainId;
  tokenBalance: TokenBalance;
  onSelect: (tokenBalance: TokenBalance) => void;
}

function SelectTokenDialogListItem({ tokenBalance, onSelect, chainId }: Props) {
  return (
    <ListItem button onClick={() => onSelect(tokenBalance)}>
      <ListItemIcon>
        {tokenBalance.token.logoURI ? (
          <Avatar
            sx={(theme) => ({
              width: 'auto',
              height: theme.spacing(4),
            })}
            src={tokenBalance.token.logoURI}
          />
        ) : (
          <Avatar
            sx={(theme) => ({
              width: theme.spacing(4),
              height: theme.spacing(4),
            })}
            src={
              tokenBalance.token.logoURI
                ? tokenBalance.token.logoURI
                : TOKEN_ICON_URL(tokenBalance.token.address, chainId as ChainId)
            }
          />
        )}
      </ListItemIcon>
      <ListItemText
        primary={tokenBalance.token.symbol}
        secondary={tokenBalance.token.name}
      />
      <ListItemSecondaryAction>
        <Typography>
          {formatUnits(tokenBalance.balance, tokenBalance.token.decimals)}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default SelectTokenDialogListItem;
