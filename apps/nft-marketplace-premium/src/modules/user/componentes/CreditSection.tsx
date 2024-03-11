import AddCreditDialog from '@dexkit/ui/components/dialogs/AddCreditDialog';
import { useCreditHistory } from '@dexkit/ui/hooks/payments';
import Add from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

import moment from 'moment';

export default function CreditSection() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const { data: credits } = useCreditHistory();

  const { formatMessage } = useIntl();

  return (
    <>
      {open && (
        <AddCreditDialog
          DialogProps={{
            open,
            onClose: handleClose,
            maxWidth: 'sm',
            fullWidth: true,
          }}
        />
      )}

      <Typography variant="subtitle1">
        <FormattedMessage id="extra.credits" defaultMessage="Extra credits" />
      </Typography>
      <Card>
        <CardContent>
          <Button
            startIcon={<Add />}
            size="small"
            variant="outlined"
            onClick={handleOpen}
          >
            <FormattedMessage id="add.credits" defaultMessage="Add credits" />
          </Button>
        </CardContent>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="status" defaultMessage="Status" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="Created" defaultMessage="Created" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="amount" defaultMessage="Amount" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credits?.map((credit, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {credit.enabled ? (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      label={formatMessage({
                        id: 'enabled',
                        defaultMessage: 'Enabled',
                      })}
                    />
                  ) : (
                    <Chip
                      size="small"
                      color="error"
                      variant="outlined"
                      label={formatMessage({
                        id: 'disabled',
                        defaultMessage: 'Disabled',
                      })}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {moment(credit.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                </TableCell>
                <TableCell>
                  <FormattedNumber
                    style="currency"
                    currency="USD"
                    value={new Decimal(credit.amount).toNumber()}
                    minimumFractionDigits={4}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
