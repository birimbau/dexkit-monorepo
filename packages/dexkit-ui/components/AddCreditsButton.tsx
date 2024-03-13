import AddCreditDialog from "@dexkit/ui/components/dialogs/AddCreditDialog";
import Add from "@mui/icons-material/Add";
import { Button, ButtonProps } from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export interface AddCreditsButtonProps {
  ButtonProps?: ButtonProps;
}

export default function AddCreditsButton({
  ButtonProps,
}: AddCreditsButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <AddCreditDialog
        DialogProps={{
          open,
          onClose: handleClose,
          maxWidth: "sm",
          fullWidth: true,
        }}
      />
      <Button
        startIcon={<Add />}
        size="small"
        variant="outlined"
        onClick={handleOpen}
        {...ButtonProps}
      >
        <FormattedMessage id="add.credits" defaultMessage="Add credits" />
      </Button>
    </>
  );
}
