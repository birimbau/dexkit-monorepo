import { NETWORKS } from '@dexkit/core/constants/networks';
import { parseChainId } from '@dexkit/core/utils';
import { AbiFragment } from '@dexkit/web3forms/types';
import { FormControl, Grid, InputLabel, MenuItem } from '@mui/material';
import { Field } from 'formik';
import { Select, TextField } from 'formik-mui';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractFormAbiInput from './ContractFormAbiInput';

export interface Props {
  abi?: AbiFragment[];
}

function ContractInitialForm({ abi }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <FormControl>
          <InputLabel shrink>
            <FormattedMessage id="network" defaultMessage="Network" />
          </InputLabel>
          <Field
            component={Select}
            type="number"
            name="chainId"
            InputLabelProps={{ shrink: true }}
            label={<FormattedMessage id="network" defaultMessage="Network" />}
            fullWidth
          >
            {Object.keys(NETWORKS).map((key) => (
              <MenuItem key={key} value={key}>
                {NETWORKS[parseChainId(key)].name}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
      </Grid>
      <Grid item xs>
        <Field
          component={TextField}
          name="contractAddress"
          label={
            <FormattedMessage
              id="contract.address"
              defaultMessage="Contract address"
            />
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <ContractFormAbiInput abiStr={JSON.stringify(abi, null, 2) || ''} />
      </Grid>
    </Grid>
  );
}

export default memo(ContractInitialForm);
