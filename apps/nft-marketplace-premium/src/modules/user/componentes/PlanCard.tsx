import { CheckRounded } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export interface PlanCardProps {
  onClick: () => Promise<void>;
  description: string;
  name: string;
  price: number;
}

export default function PlanCard({
  onClick,
  name,
  description,
  price,
}: PlanCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography variant="body1" color="text.secondary">
              {name}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              <FormattedNumber
                currencyDisplay="narrowSymbol"
                currencySign="standard"
                maximumFractionDigits={2}
                minimumFractionDigits={2}
                value={price}
                style="currency"
                currency="USD"
              />
            </Typography>
          </div>
          <Typography variant="body2">{description}</Typography>
          <Divider />
          <Stack spacing={1}>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              direction="row"
            >
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage
                  defaultMessage="AI Assistant"
                  id="ai.assistant"
                />
              </Typography>
              <CheckRounded color="success" />
            </Stack>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              direction="row"
            >
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage
                  defaultMessage="New AI Features"
                  id="new.ai.features"
                />
              </Typography>
              <Typography variant="body2">
                <FormattedMessage
                  id="coming.soon"
                  defaultMessage="Coming soon"
                />
              </Typography>
            </Stack>
          </Stack>
          <Button onClick={onClick} variant="contained" color="primary">
            <FormattedMessage id="select.plan" defaultMessage="Select Plan" />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
