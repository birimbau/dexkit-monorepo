import { truncateAddress } from '@dexkit/core/utils';
import { ContractFormFieldInputAddress } from '@dexkit/web3forms/types';
import { Grid, TextField as MuiTextField } from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { Field } from 'formik';
import { Autocomplete } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export function AddressInput({
  input,
  funcName,
  inputName,
}: {
  input: ContractFormFieldInputAddress;
  funcName?: string;
  inputName?: string;
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          component={Autocomplete}
          freeSolo
          multiple
          size="small"
          autoSelect
          name={`fields.${funcName}.input.${inputName}.addresses`}
          options={input.addresses ? input.addresses : []}
          getOptionLabel={(option: string) => {
            if (isAddress(option)) {
              return truncateAddress(option);
            }

            return (
              <FormattedMessage
                id="invalid.address"
                defaultMessage="Invalid address"
              />
            );
          }}
          filterSelectedOptions
          renderInput={(params: any) => (
            <MuiTextField
              {...params}
              label={
                <FormattedMessage id="addresses" defaultMessage="Addresses" />
              }
              placeholder="Address"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
