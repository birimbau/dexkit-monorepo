import { Stack, Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  onBack?: () => void;
  onContinue?: () => void;
  disableContinue?: boolean;
  disableBack?: boolean;
  hideBackButton?: boolean;
}

export function StepperButtons({
  onBack,
  onContinue,
  disableContinue,
  disableBack,
}: Props) {
  return (
    <Stack direction="row" spacing={2}>
      {onContinue && (
        <Button
          disabled={disableContinue}
          onClick={onContinue}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="continue" defaultMessage="Continue" />
        </Button>
      )}
      {onBack && (
        <Button
          variant="contained"
          color="inherit"
          disabled={disableBack}
          onClick={onBack}
        >
          <FormattedMessage id="back" defaultMessage="Back" />
        </Button>
      )}
    </Stack>
  );
}
