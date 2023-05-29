import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { parseChainId } from '@dexkit/core/utils';
import { AbiFragment } from '@dexkit/web3forms/types';
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { Field } from 'formik';
import { Checkbox, Select } from 'formik-mui';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractFormAbiInput from './ContractFormAbiInput';
import ContractFormAddressInput from './ContractFormAddressInput';

export interface Props {
  abi?: AbiFragment[];
  chainId?: ChainId;
}

function ContractInitialForm({ abi, chainId }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          label={
            <FormattedMessage
              id="use.as.a.proxy"
              defaultMessage="Use as a proxy"
            />
          }
          control={
            <Field type="checkbox" component={Checkbox} name="isProxy" />
          }
        />
      </Grid>
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
        <ContractFormAddressInput chainId={chainId} />
      </Grid>
      <Grid item xs={12}>
        <ContractFormAbiInput abiStr={JSON.stringify(abi, null, 2) || ''} />
      </Grid>
    </Grid>
  );
}

export default memo(ContractInitialForm);
