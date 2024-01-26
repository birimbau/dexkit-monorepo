import {
  Avatar,
  Checkbox,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { Token } from '../../../../types/blockchain';
import { TOKEN_ICON_URL } from '../../../../utils/token';

import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import TokenIcon from '@mui/icons-material/Token';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  token: Token;
  selectable?: boolean;
  selected?: boolean;
  onClick: () => void;
  onMakeTradable?: () => void;
  disableMakeTradable?: boolean;
  divider?: boolean;
}

export default function TokensSectionListItem({
  token,
  selectable,
  selected,
  onClick,
  onMakeTradable,
  divider,
  disableMakeTradable,
}: Props) {
  const { formatMessage } = useIntl();
  const { NETWORK_NAME } = useNetworkMetadata();

  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar
          src={
            token.logoURI
              ? token.logoURI
              : TOKEN_ICON_URL(token.address, token.chainId)
          }
          alt={formatMessage({ id: 'token', defaultMessage: 'Token' })}
        >
          <TokenIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component="div" sx={{ fontWeigth: 600 }}>
            {token.name}{' '}
            <Typography
              component="span"
              variant="caption"
              color="textSecondary"
            >
              {token.symbol}
            </Typography>
          </Typography>
        }
        secondary={
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            <Chip size="small" label={NETWORK_NAME(token.chainId)} />

            {token.tradable && (
              <Tooltip
                title={
                  <FormattedMessage
                    id="this.token.is.available.on.the.marketplace"
                    defaultMessage="This token is available on the marketplace"
                  />
                }
              >
                <Chip
                  size="small"
                  label={
                    <FormattedMessage id="tradable" defaultMessage="Tradable" />
                  }
                />
              </Tooltip>
            )}
          </Stack>
        }
      />

      {(!(disableMakeTradable === true) || selectable) && (
        <ListItemSecondaryAction>
          {selectable ? (
            <Checkbox
              checked={Boolean(selected)}
              onChange={(e, checked) => onClick()}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            <Tooltip
              title={
                <FormattedMessage
                  id="make.token.available.on.the.marketplace"
                  defaultMessage="Make token available on the marketplace"
                />
              }
            >
              <Switch
                checked={Boolean(token.tradable)}
                onClick={onMakeTradable}
              />
            </Tooltip>
          )}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
