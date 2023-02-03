import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import AppDialogTitle from "../../components/AppDialogTitle";
import SearchTextField from "../../components/SearchTextField";
import SelectCoinList from "../../components/SelectCoinList";
import { Token } from "../../types";

export interface SwapSelectCoinDialogProps {
  DialogProps: DialogProps;
  onQueryChange: (value: string) => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
}

export default function SwapSelectCoinDialog({
  DialogProps,
  tokens,
  onSelect,
  onQueryChange,
}: SwapSelectCoinDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

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
          <SelectCoinList tokens={tokens} onSelect={onSelect} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
