import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
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
  tokens: Token[];
  account?: string;
  provider?: providers.BaseProvider;
}

export default function SwapSelectCoinDialog({
  DialogProps,
  tokens,
  account,
  provider,
  onSelect,
  onQueryChange,
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
        <Stack spacing={2}>
          <Box sx={{ px: 2 }}>
            <SearchTextField
              onChange={onQueryChange}
              TextFieldProps={{ fullWidth: true }}
            />
          </Box>
          <SwapFeaturedTokens onSelect={onSelect} chainId={chainId} />
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
