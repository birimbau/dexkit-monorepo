import { Box, Skeleton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';
import {
  useCheckStripeSubscriptionQuery,
  useSiteCancelSubscriptionMutation,
  useSiteStripeCheckoutMutation,
} from '../../hooks/stripe';
const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog')
);

interface Props {
  site?: SiteResponse;
}

export default function BillingContainer({ site }: Props) {
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const checkoutMutation = useSiteStripeCheckoutMutation();
  const cancelMutation = useSiteCancelSubscriptionMutation();

  const subscription = useCheckStripeSubscriptionQuery({ siteId: site?.id });

  console.log(subscription.data);

  return (
    <>
      {confirmOpen && (
        <AppConfirmDialog
          DialogProps={{
            open: confirmOpen,
            onClose: () => setConfirmOpen(false),
          }}
          onConfirm={() => {
            cancelMutation.mutate({ siteId: site?.id });
            setConfirmOpen(false);
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.cancel.builder.plan"
            defaultMessage="Do you really want to cancel subscription for Builder plan?"
          />
        </AppConfirmDialog>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'subtitle2'}>
              <FormattedMessage id="billing" defaultMessage="Billing" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage id="app.billing" defaultMessage="App billing" />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Typography>
              <FormattedMessage
                id="subscription"
                defaultMessage="Subscription"
              />
            </Typography>
            {subscription.isLoading ? (
              <Skeleton>
                <FormattedMessage
                  id="loading.subscription.status"
                  defaultMessage="Loading subscription status"
                />
              </Skeleton>
            ) : subscription.data &&
              subscription?.data?.data[0]?.status === 'active' ? (
              <>
                <Alert severity="info">
                  <Typography variant="subtitle1">
                    <FormattedMessage
                      id="you.are.subscribed.to.builder.plan"
                      defaultMessage="You are subscribed to Builder plan"
                    />
                  </Typography>
                </Alert>
                <Typography>
                  <FormattedMessage
                    id="billing.monthly"
                    defaultMessage="Billing monthly. Next invoice on {date} for {amount}"
                    values={{
                      date: intl.formatDate(
                        new Date(
                          (subscription.data as any)?.data[0]
                            .current_period_end * 1000
                        ),
                        {
                          year: 'numeric',
                          day: 'numeric',
                          month: 'long',
                        }
                      ),
                      amount: intl.formatNumber(100, {
                        currency: 'usd',
                        style: 'currency',
                      }),
                    }}
                  />
                </Typography>
                <Stack justifyContent={'flex-end'}>
                  <Box display={'flex'} justifyContent={'flex-end'}>
                    <Button
                      variant={'contained'}
                      color="error"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    </Button>
                  </Box>
                </Stack>
              </>
            ) : (
              <>
                <Alert severity="info">
                  {' '}
                  <FormattedMessage
                    id="subscription.info.text"
                    defaultMessage="Subscribe to Builder plan to unlock all features on DexAppBuilder"
                  />
                </Alert>
                <Box>
                  <Button
                    variant={'contained'}
                    onClick={async () => {
                      const response = await checkoutMutation.mutateAsync({
                        siteId: site?.id,
                      });

                      window.open(response?.data?.url, '_blank');
                    }}
                  >
                    <FormattedMessage
                      id="subscribe"
                      defaultMessage="Subscribe"
                    />
                  </Button>
                </Box>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
