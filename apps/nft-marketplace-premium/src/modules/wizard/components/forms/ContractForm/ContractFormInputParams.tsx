import { truncateAddress } from '@dexkit/core/utils';
import {
  ContractFormFieldInput,
  ContractFormFieldInputAddress,
  ContractFormParams,
} from '@dexkit/web3forms/types';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { isAddress } from 'ethers/lib/utils';

import { Field, useFormikContext } from 'formik';
import { Autocomplete } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

function AddressInput({
  input,
  funcName,
  inputName,
}: {
  input: ContractFormFieldInputAddress;
  funcName?: string;
  inputName?: string;
}) {
  const { values } = useFormikContext<ContractFormParams>();

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
            <TextField
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

export interface ContractFormInputParamsProps {
  input?: ContractFormFieldInput;
  funcName?: string;
  inputName?: string;
}

export default function ContractFormInputParams({
  input,
  funcName,
  inputName,
}: ContractFormInputParamsProps) {
  if (input?.inputType === 'address') {
    return (
      <AddressInput funcName={funcName} inputName={inputName} input={input} />
    );
  }

  return null;
}
