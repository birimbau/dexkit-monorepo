import {
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import moment from 'moment';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Link from 'src/components/Link';
import {
  useActiveFeatUsage,
  useBillingHistoryQuery,
  usePlanCheckoutMutation,
  useSubscription,
} from '../hooks/payments';
import CreditSection from './CreditSection';
import PlanCard from './PlanCard';

export default function BillingSection() {
  const billingHistoryQuery = useBillingHistoryQuery();

  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();

  const subscriptionQuery = useSubscription();
  const activeFeatUsageQuery = useActiveFeatUsage();

  const handleCheckoutStarter = (plan: string) => {
    return async () => {
      const result = await checkoutPlan({ plan });

      if (result && result?.url) {
        window.open(result.url, '_blank');
      }
    };
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          {subscriptionQuery.isSuccess && !subscriptionQuery.data && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <PlanCard
                  disabled={isLoading}
                  name="Starter"
                  price={10.0}
                  description="Better to start"
                  onClick={handleCheckoutStarter('starter')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PlanCard
                  disabled={isLoading}
                  name="Plus"
                  price={20.0}
                  description="Better to start"
                  onClick={handleCheckoutStarter('plus')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PlanCard
                  disabled={isLoading}
                  name="Premium"
                  price={50.0}
                  description="Better to start"
                  onClick={handleCheckoutStarter('premium')}
                />
              </Grid>
            </Grid>
          )}{' '}
          {!(subscriptionQuery.isSuccess && !subscriptionQuery.data) && (
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage
                    id="ref.period"
                    defaultMessage="Ref. period"
                  />
                </Typography>
                <Typography variant="body1">
                  {activeFeatUsageQuery.data ? (
                    <Link
                      href={`/u/settings/billing/${activeFeatUsageQuery.data.id}`}
                    >
                      {moment(activeFeatUsageQuery.data.periodStart).format(
                        'MM/YYYY',
                      )}
                    </Link>
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="credits" defaultMessage="Credits" />
                </Typography>
                <Typography variant="body1">
                  {activeFeatUsageQuery.data ? (
                    <FormattedNumber
                      style="currency"
                      currencyDisplay="narrowSymbol"
                      currency="USD"
                      value={new Decimal(activeFeatUsageQuery.data?.available)
                        .minus(new Decimal(activeFeatUsageQuery.data?.used))
                        .toNumber()}
                      minimumFractionDigits={4}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="plan" defaultMessage="Plan" />
                </Typography>
                <Typography variant="body1">
                  {subscriptionQuery.data ? (
                    subscriptionQuery.data.planName
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="status" defaultMessage="Status" />
                </Typography>
                <Typography variant="body1">
                  {subscriptionQuery.data ? (
                    subscriptionQuery.data.status
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="start" defaultMessage="Start" />
                </Typography>
                <Typography variant="body1">
                  {moment(subscriptionQuery.data?.period_start).format(
                    'DD/MM/YYYY HH:mm:ss',
                  )}{' '}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="end" defaultMessage="End" />
                </Typography>
                <Typography variant="body1">
                  {moment(subscriptionQuery.data?.period_end).format(
                    'DD/MM/YYYY HH:mm:ss',
                  )}
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      <Typography variant="subtitle1">
        <FormattedMessage id="usage.periods" defaultMessage="Usage periods" />
      </Typography>
      <Card>
        {billingHistoryQuery.data && billingHistoryQuery.data.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="month" defaultMessage="Month" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="total" defaultMessage="Total" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingHistoryQuery.data?.map((period: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      variant="body1"
                      href={`/u/settings/billing/${period.id}`}
                    >
                      {moment(period.periodStart).format('MM/YYYY')}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <FormattedNumber
                        value={new Decimal(period.used).toNumber()}
                        style="currency"
                        currencyDisplay="narrowSymbol"
                        currency="USD"
                        minimumFractionDigits={4}
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <CardContent sx={{ py: 2 }}>
            <Typography align="center" variant="h5">
              <FormattedMessage id="no.usage" defaultMessage="No usage" />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="you.still.dont.have.any.records"
                defaultMessage="You still don't have any records."
              />
            </Typography>
          </CardContent>
        )}
      </Card>
      <CreditSection />
    </Stack>
  );
}
