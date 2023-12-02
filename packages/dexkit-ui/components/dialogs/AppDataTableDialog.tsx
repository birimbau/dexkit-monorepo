import AppDataTable from "@dexkit/ui/components/AppDataTable";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";

export interface AppDataTableDialogProps {
  DialogProps: DialogProps;
  onConfirm: (data: { [key: string]: string }[]) => void;
  value: { [key: string]: string }[];
  title: React.ReactNode;
  dataColumns: {
    isValid?: ((value: unknown) => boolean) | undefined;
    name: string;
    headerName: string;
    editable?: boolean | undefined;
  }[];
}

export default function AppDataTableDialog({
  DialogProps,
  onConfirm,
  value,
  dataColumns,
  title,
}: AppDataTableDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setValues(undefined);
  };

  const [values, setValues] =
    useState<{ address: string; quantity: string }[]>();

  const handleConfirm = () => {
    if (values) {
      onConfirm(values);
      handleClose();
    }
  };

  const handleChange = (data: { address: string; quantity: string }[]) => {
    setValues(data);
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle title={title} />
      <DialogContent sx={{ p: 0 }} dividers>
        <AppDataTable
          dataColumns={dataColumns}
          data={value}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
