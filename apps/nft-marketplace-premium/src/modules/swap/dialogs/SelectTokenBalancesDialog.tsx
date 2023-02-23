import {
  Avatar,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from '../../../components/AppDialogTitle';
import { ChainId } from '../../../constants/enum';
import { useERC20BalancesProxyAllowancesQuery } from '../../../hooks/balances';
import { useTokenList } from '../../../hooks/blockchain';
import { TokenBalance, Token } from '../../../types/blockchain';
import { TOKEN_ICON_URL } from '../../../utils/token';
import SelectTokenDialogListItem from './SelectTokenDialogListItem';

interface Props {
  dialogProps: DialogProps;
  onSelect: (tokenBalance: TokenBalance) => void;
  excludeToken?: TokenBalance;
  selectedChainId?: ChainId;
}

function SelectTokenBalanceDialog({
  dialogProps,
  onSelect,
  excludeToken,
  selectedChainId,
}: Props) {
  const { onClose } = dialogProps;
  const { chainId, isActive } = useWeb3React();
  const tokenBalancesQuery = useERC20BalancesProxyAllowancesQuery(
    undefined,
    selectedChainId || chainId
  );
  const tokens = useTokenList({
    chainId: selectedChainId,
    includeNative: true,
  });
  const [value, setValue] = useState('');

  const tokenBalances = tokenBalancesQuery.data;

  const handelClose = () => {
    onClose!({}, 'backdropClick');
    setValue('');
  };

  return (
    <Dialog {...dialogProps} onClose={handelClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.a.token"
            defaultMessage={'Select a token'}
            description={'Select a token message'}
          />
        }
        onClose={handelClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              placeholder="Search for a token name"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {isActive && chainId ? (
              <List disablePadding>
                {tokenBalances
                  ?.filter((token) => {
                    return excludeToken !== token;
                  })
                  ?.filter((tokenBalance) => {
                    return (
                      tokenBalance.token.name
                        .toLowerCase()
                        .search(value.toLowerCase()) > -1 ||
                      tokenBalance.token.symbol
                        .toLowerCase()
                        .search(value.toLowerCase()) > -1
                    );
                  })
                  .map((tokenBalance: TokenBalance, index: number) => (
                    <SelectTokenDialogListItem
                      key={index}
                      tokenBalance={tokenBalance}
                      onSelect={onSelect}
                      chainId={chainId}
                    />
                  ))}
              </List>
            ) : (
              <List disablePadding>
                {tokens
                  ?.filter((token) => {
                    return excludeToken?.token !== token;
                  })
                  ?.filter((token) => {
                    return (
                      token.name.toLowerCase().search(value.toLowerCase()) >
                        -1 ||
                      token.symbol.toLowerCase().search(value.toLowerCase()) >
                        -1
                    );
                  })
                  .map((token: Token, index: number) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() =>
                        onSelect({
                          token: token,
                          isProxyUnlocked: false,
                          balance: BigNumber.from(0),
                        })
                      }
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={(theme) => ({
                            width: 'auto',
                            height: theme.spacing(4),
                          })}
                          src={
                            token.logoURI
                              ? token.logoURI
                              : TOKEN_ICON_URL(
                                  token.address,
                                  selectedChainId as ChainId
                                )
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={token.symbol}
                        secondary={token.name}
                      />
                    </ListItem>
                  ))}
              </List>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SelectTokenBalanceDialog);
