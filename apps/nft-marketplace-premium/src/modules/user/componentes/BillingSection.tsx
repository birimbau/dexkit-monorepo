import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Link from 'src/components/Link';
import { useBillingHistoryQuery } from '../hooks/payments';

export default function BillingSection() {
  const billingHistoryQuery = useBillingHistoryQuery();

  return (
    <>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="month" defaultMessage="Month" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="month" defaultMessage="Total" />
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
                    {period.periodStart}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography>
                    <FormattedNumber
                      value={period.used}
                      style="currency"
                      currencyDisplay="narrowSymbol"
                      currency="USD"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
