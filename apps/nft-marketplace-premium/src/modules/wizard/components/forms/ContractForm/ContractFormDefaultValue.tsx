import {
  AbiFragment,
  AbiFragmentInput,
  ContractFormParams,
} from '@dexkit/web3forms/types';
import { Switch } from '@mui/material';
import { FastField, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

function requiredField(message: string) {
  return (value: string) => {
    return !value ? message : undefined;
  };
}

export default function ContractFormDefaultValueInput({
  values,
  func,
  input,
}: {
  values: ContractFormParams;
  func: AbiFragment;
  input: AbiFragmentInput;
}) {
  const { formatMessage } = useIntl();
  const { setFieldValue } = useFormikContext();

  const handleChangeValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setFieldValue(
        `fields.${func.name}.input.${input.name}.defaultValue`,
        checked
      ),
    [func, input]
  );

  const inputType = useMemo(() => {
    if (
      values.fields[func.name] &&
      values.fields[func.name].input[input.name]
    ) {
      return values.fields[func.name].input[input.name].inputType;
    }
  }, [values, func, input]);

  if (inputType === 'switch') {
    return <Switch onChange={handleChangeValue} type="checkbox" />;
  }

  return (
    <FastField
      component={TextField}
      name={`fields.${func.name}.input.${input.name}.defaultValue`}
      validate={
        (values as ContractFormParams).fields[func.name]?.hideInputs
          ? requiredField(
              formatMessage(
                {
                  id: 'field.is.required',
                  defaultMessage: '{field} is required',
                },
                {
                  field: input.name,
                }
              )
            )
          : undefined
      }
      label={
        <FormattedMessage id="default.value" defaultMessage="Default value" />
      }
      fullWidth
      size="small"
    />
  );
}
