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
import { useMultiTokenBalance } from "../../hooks";
import { Token } from "../../types";

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
