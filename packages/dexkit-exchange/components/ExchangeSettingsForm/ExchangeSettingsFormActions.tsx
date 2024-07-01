import { Box, Button, Grid, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useFormikContext } from "formik";

export interface FormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function FormActions({ onCancel, onSubmit }: FormActionsProps) {
  const { isValid } = useFormikContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button onClick={onCancel}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button disabled={!isValid} onClick={onSubmit} variant="contained">
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
