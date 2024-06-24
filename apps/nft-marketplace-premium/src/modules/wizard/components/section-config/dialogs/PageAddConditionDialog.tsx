import { AppDialogTitle } from '@dexkit/ui';
import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
  Typography,
  alpha,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface PageAddConditionDialogProps {
  DialogProps: DialogProps;
}

export default function PageAddConditionDialog({
  DialogProps,
}: PageAddConditionDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        onClose={handleClose}
        title={
          <FormattedMessage
            id="add.gated.condition"
            defaultMessage="Add gated condition"
          />
        }
      />
      <DialogContent sx={{ px: 4 }}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase
              sx={{
                px: 1,
                py: 0.25,

                borderRadius: (theme) => theme.shape.borderRadius / 2,
                '&: hover': {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                },
              }}
              onClick={() => {}}
            >
              <Typography
                variant="h5"
                sx={{
                  cursor: 'pointer',
                }}
              >
                Condition
              </Typography>
            </ButtonBase>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item></Grid>
              <Grid item></Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button>
          <FormattedMessage id="add" defaultMessage="Add" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
