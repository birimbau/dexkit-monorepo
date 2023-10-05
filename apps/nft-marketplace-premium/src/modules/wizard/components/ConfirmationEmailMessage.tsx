import { Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';
import { useSendSiteConfirmationLinkMutation } from '../hooks';
const ActionMutationDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/ActionMutationDialog'),
);

export function ConfirmationEmailMessage({ site }: { site?: SiteResponse }) {
  const [open, setOpen] = useState<boolean>(false);
  const siteConfirmationMutation = useSendSiteConfirmationLinkMutation();

  return (
    <>
      {open && (
        <ActionMutationDialog
          dialogProps={{
            open: open,
            onClose: () => {
              siteConfirmationMutation.reset();
              setOpen(false);
            },
            fullWidth: true,
            maxWidth: 'sm',
          }}
          isSuccess={siteConfirmationMutation.isSuccess}
          isLoading={siteConfirmationMutation.isLoading}
          isError={siteConfirmationMutation.isError}
          error={siteConfirmationMutation.error}
        />
      )}

      <Alert severity="info">
        <Stack
          direction={'row'}
          alignContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Typography>
            <FormattedMessage
              id="site.email.not.verified.on.admin.message"
              defaultMessage="Your site email is not verified, please verify using the verification email we sent. If you not received, request new confirmation email."
            />
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
              siteConfirmationMutation.mutate({ siteId: site?.id });
            }}
          >
            {' '}
            <FormattedMessage
              id={'request.confirmation.email'}
              defaultMessage={'Request confirmation email'}
            />
          </Button>
        </Stack>
      </Alert>
    </>
  );
}
