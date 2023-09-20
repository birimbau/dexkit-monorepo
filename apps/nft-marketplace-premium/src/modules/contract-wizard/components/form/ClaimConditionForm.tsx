import { SearchTokenAutocomplete } from '@/modules/wizard/components/forms/SearchTokenAutocomplete';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useTokenList } from '@dexkit/ui';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { ClaimCondition } from '@thirdweb-dev/sdk';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

interface Props {
  itemIndex: number;
  network: string;
}

export function ClaimConditionForm({ itemIndex, network }: Props) {
  const tokens = useTokenList({ chainId: NETWORK_FROM_SLUG(network)?.chainId });

  const { setFieldValue, values, errors } = useFormikContext<ClaimCondition>();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Stack spacing={2}>
            <Field
              component={TextField}
              name={`items[${itemIndex}].name`}
              label={<FormattedMessage id="name" defaultMessage="Name" />}
              fullWidth
            />
            <Field
              component={TextField}
              name={`items[${itemIndex}].startTime`}
              type={'date'}
              label={
                <FormattedMessage id="start.time" defaultMessage="Start Time" />
              }
              fullWidth
            />
            <Field
              component={TextField}
              name={`items[${itemIndex}].waitInSeconds`}
              type={'date'}
              label={
                <FormattedMessage
                  id="wait.in.seconds"
                  defaultMessage="Wait in seconds"
                />
              }
              fullWidth
            />
          </Stack>
        </Grid>
        <Grid item xs>
          <Stack spacing={2} direction={'row'}>
            <Field
              component={TextField}
              name={`items[${itemIndex}].maxClaimableSupply`}
              label={
                <FormattedMessage
                  id="total.items.to.claim"
                  defaultMessage="Total items to claim"
                />
              }
            />
            <Field
              component={TextField}
              name={`items[${itemIndex}].maxClaimablePerWallet`}
              label={
                <FormattedMessage
                  id="total.items.to.claim.per.wallet"
                  defaultMessage="Total items to claim per wallet"
                />
              }
            />
          </Stack>
        </Grid>
        <Grid item xs>
          <Stack spacing={2} direction={'row'}>
            <Field
              component={TextField}
              name={`items[${itemIndex}].pricePerToken`}
              label={
                <FormattedMessage
                  id="Price per token"
                  defaultMessage="Price per token"
                />
              }
              fullWidth
            />
            <SearchTokenAutocomplete tokens={tokens}></SearchTokenAutocomplete>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
