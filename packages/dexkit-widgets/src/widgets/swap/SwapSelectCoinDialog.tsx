import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  ListSubheader,
  Stack,
} from "@mui/material";
import { providers } from "ethers";
import { FormattedMessage } from "react-intl";
import AppDialogTitle from "../../components/AppDialogTitle";
import SearchTextField from "../../components/SearchTextField";
import SelectCoinList from "../../components/SelectCoinList";
import { ChainId } from "../../constants/enum";
import { useAsyncMemo, useMultiTokenBalance } from "../../hooks";
import { Token } from "../../types";
import SwapFeaturedTokens from "./SwapFeaturedTokens";

export interface SwapSelectCoinDialogProps {
  DialogProps: DialogProps;
  onQueryChange: (value: string) => void;
  onSelect: (token: Token) => void;
  onClearRecentTokens: () => void;
  tokens: Token[];
  recentTokens?: Token[];
  account?: string;
  provider?: providers.BaseProvider;
}

export default function SwapSelectCoinDialog({
  DialogProps,
  tokens,
  recentTokens,
  account,
  provider,
  onSelect,
  onQueryChange,
  onClearRecentTokens,
}: SwapSelectCoinDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const tokenBalances = useMultiTokenBalance({ tokens, account, provider });

  const chainId = useAsyncMemo<ChainId | undefined>(
    async (initial?: ChainId) => {
      if (provider) {
        return (await provider?.getNetwork()).chainId;
      }

      return initial;
    },
    undefined,
    [provider]
  );

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.token" defaultMessage="Select token" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ px: 0 }}>
        <Stack>
          <Stack spacing={2} sx={{ pb: 2 }}>
            <Box sx={{ px: 2 }}>
              <SearchTextField
                onChange={onQueryChange}
                TextFieldProps={{ fullWidth: true }}
              />
            </Box>
            <SwapFeaturedTokens onSelect={onSelect} chainId={chainId} />
          </Stack>
          {recentTokens && recentTokens?.length > 0 && (
            <>
              <Divider />
              <SelectCoinList
                subHeader={
                  <Box
                    sx={{
                      px: 2,
                      background: (theme) => theme.palette.grey[200],
                    }}
                  >
                    <Stack
                      justifyContent="space-between"
                      alignItems="center"
                      direction="row"
                    >
                      <ListSubheader
                        sx={{ p: 0, m: 0 }}
                        component="div"
                        disableSticky
                      >
                        <FormattedMessage id="recent" defaultMessage="Recent" />
                      </ListSubheader>

                      <Button
                        onClick={onClearRecentTokens}
                        size="small"
                        color="primary"
                      >
                        <FormattedMessage id="clear" defaultMessage="Clear" />
                      </Button>
                    </Stack>
                  </Box>
                }
                tokens={recentTokens}
                tokenBalances={tokenBalances.data}
                onSelect={onSelect}
              />
            </>
          )}

          <Divider />
          <SelectCoinList
            tokens={tokens}
            onSelect={onSelect}
            tokenBalances={tokenBalances.data}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
