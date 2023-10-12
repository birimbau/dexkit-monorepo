import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

import { ChangeEvent, memo, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AppDialogTitle } from "../../../../components/AppDialogTitle";

interface SwapSettingsDialogProps {
  DialogProps: DialogProps;
  maxSlippage: number;
  title?: JSX.Element;
  isAutoSlippage: boolean;
  onAutoSlippage: (value: boolean) => void;
  onChangeSlippage: (value: number) => void;
}

function SwapSettingsDialog({
  DialogProps,
  maxSlippage,
  isAutoSlippage,
  onAutoSlippage,
  onChangeSlippage,
  title,
}: SwapSettingsDialogProps) {
  const { onClose } = DialogProps;

  const [slippage, setSlippage] = useState<string>(
    (maxSlippage * 100).toString()
  );

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  const handleToggleAutoSlippage = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    return onAutoSlippage(checked);
  };

  const handleChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
    setSlippage(e.target.value);
  };

  const handleSave = () => {
    if (isAutoSlippage) {
      onChangeSlippage(0);
      setSlippage("0.0");
    } else {
      onChangeSlippage(parseFloat(slippage) / 100);
    }
    handleClose();
  };

  const { formatMessage } = useIntl();

  const slippageError = useMemo(() => {
    if (parseFloat(slippage) > 100) {
      return formatMessage({
        id: "slippage.is.above.one.hundred.percent",
        defaultMessage: "Slippage is above 100%",
      });
    } else if (parseFloat(slippage) < 0) {
      return formatMessage({
        id: "slippage.is.below.zero",
        defaultMessage: "Slippage is below zero",
      });
    }
  }, [slippage]);

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          title ? (
            title
          ) : (
            <FormattedMessage
              id="swap.settings"
              defaultMessage="Swap Settings"
            />
          )
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isAutoSlippage}
                onChange={handleToggleAutoSlippage}
              />
            }
            label={
              <FormattedMessage
                id="auto.slippage"
                defaultMessage="Auto Slippage"
              />
            }
          />
          {!isAutoSlippage && (
            <TextField
              value={slippage}
              onChange={handleChangeSlippage}
              type="number"
              fullWidth
              error={Boolean(slippageError)}
              helperText={slippageError}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(SwapSettingsDialog);
