import { Dialog, DialogProps } from "@mui/material";
import SelectIconGrid from "../SelectIconGrid";

export interface SelectIconDialogProps {
  DialogProps: DialogProps;
}

export default function SelectIconDialog({
  DialogProps,
}: SelectIconDialogProps) {
  return (
    <Dialog {...DialogProps}>
      <SelectIconGrid />
    </Dialog>
  );
}
