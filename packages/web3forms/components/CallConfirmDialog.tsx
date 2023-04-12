import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FormattedMessage } from "react-intl";

import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import {
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { ChangeEvent, useState } from "react";
import { PARSE_UNITS } from "../constants";

export interface CallConfirmDialogProps {
  DialogProps: DialogProps;
  onConfirm: (value: BigNumber) => void;
}

export default function CallConfirmDialog({
  DialogProps,
  onConfirm,
}: CallConfirmDialogProps) {
  const { onClose } = DialogProps;

  const [unit, setUnit] = useState(PARSE_UNITS[0]);

  const [value, setValue] = useState({ value: "", parsed: BigNumber.from(0) });

  const handleChangeUnit = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    setUnit(event.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let parsedValue = BigNumber.from(0);

    const regex = /^\d+\.?(?:\d{1,2})?$/;

    try {
      parsedValue = ethers.utils.parseUnits(e.target.value, unit);
    } catch (err) {}

    if (regex.test(e.target.value)) {
      setValue({ value: e.target.value, parsed: parsedValue });
    }
  };

  const handleConfirm = () => {
    onConfirm(value.parsed);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="confirm.call" defaultMessage="Confirm call" />
        }
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              label={<FormattedMessage id="amount" defaultMessage="Amount" />}
              value={value.value}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Select value={unit} onChange={handleChangeUnit}>
              {PARSE_UNITS.map((unit, key) => (
                <MenuItem value={unit} key={key}>
                  {unit.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
