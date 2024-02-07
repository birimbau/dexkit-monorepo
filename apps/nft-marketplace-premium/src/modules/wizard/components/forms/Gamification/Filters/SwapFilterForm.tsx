import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../../../ChangeListener';
import { SearchTokenAutocompleteWithTokens } from '../../SearchTokenAutocomplete';
import { Conditions } from '../constants/conditions';

interface SwapFilter {
  chainId?: number;
  tokenInAddress?: string;
  conditionIn?: string;
  amountIn?: number;
  tokenOutAddress?: string;
  amountOut?: number;
  conditionOut?: string;
}

const SwapFilterSchema: Yup.SchemaOf<SwapFilter> = Yup.object().shape({
  chainId: Yup.number(),
  tokenInAddress: Yup.string(),
  conditionIn: Yup.string(),
  amountIn: Yup.number(),
  tokenOutAddress: Yup.string(),
  amountOut: Yup.number(),
  conditionOut: Yup.string(),
});

interface Props {
  onSubmit?: (item: SwapFilter) => void;
  onChange?: (item: SwapFilter, isValid: boolean) => void;
  item?: SwapFilter;
}

export default function SwapFilterForm({ item, onSubmit, onChange }: Props) {
  return (
    <Formik
      initialValues={{ ...item }}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values as SwapFilter);
        }
      }}
      validationSchema={SwapFilterSchema}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
        resetForm,
      }) => (
        <Form>
          <ChangeListener
            values={values}
            isValid={isValid}
            onChange={onChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="caption">
                  <FormattedMessage
                    id="choose.network"
                    defaultMessage="Choose network"
                  />
                </Typography>
                <NetworkSelectDropdown
                  chainId={values.chainId}
                  onChange={(chainId) => {
                    setFieldValue('chainId', chainId);
                    setFieldValue('tokenOutAddress', undefined);
                    setFieldValue('tokenInAddress', undefined);
                  }}
                  labelId="Choose network"
                  enableTestnet={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <SearchTokenAutocompleteWithTokens
                label={
                  <FormattedMessage
                    id="search.token.in"
                    defaultMessage="Search token in"
                  />
                }
                disabled={values.chainId === undefined}
                data={{
                  address: values.tokenInAddress,
                  chainId: values.chainId,
                }}
                chainId={values.chainId}
                onChange={(tk: any) => {
                  if (tk) {
                    setFieldValue('tokenInAddress', tk.address);
                  } else {
                    setFieldValue('tokenInAddress', undefined);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="condition-amount-in-select-label">
                  <FormattedMessage
                    id="condition.amount.in"
                    defaultMessage="Condition amount in"
                  />
                </InputLabel>
                <Select
                  labelId="condition-amount-in-select-label"
                  id="demo-simple-select"
                  value={values.conditionIn}
                  label={
                    <FormattedMessage
                      id="condition.amount.in"
                      defaultMessage="Condition amount in"
                    />
                  }
                  onChange={(ev) =>
                    setFieldValue('conditionIn', ev.target.value)
                  }
                >
                  {Conditions.map((v, i) => (
                    <MenuItem value={v} key={i}>
                      {v}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Field
                component={TextField}
                type="number"
                fullWidth
                label={
                  <FormattedMessage
                    id={'Amount in'}
                    defaultMessage={'Amount In'}
                  />
                }
                InputProps={{ min: 0 }}
                name="amountIn"
              />
            </Grid>

            <Grid item xs={12}>
              <SearchTokenAutocompleteWithTokens
                label={
                  <FormattedMessage
                    id="search.token.out"
                    defaultMessage="Search token out"
                  />
                }
                disabled={values.chainId === undefined}
                data={{
                  address: values.tokenOutAddress,
                  chainId: values.chainId,
                }}
                chainId={values.chainId}
                onChange={(tk: any) => {
                  if (tk) {
                    setFieldValue('tokenOutAddress', tk.address);
                  } else {
                    setFieldValue('tokenOutAddress', undefined);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="condition-amount-out-select-label">
                  <FormattedMessage
                    id="condition.amount.out"
                    defaultMessage="Condition amount out"
                  />
                </InputLabel>
                <Select
                  labelId="condition-amount-out-select-label"
                  id="select-amount-out-id"
                  value={values.conditionOut}
                  label={
                    <FormattedMessage
                      id="condition.amount.out"
                      defaultMessage="Condition amount out"
                    />
                  }
                  onChange={(ev) =>
                    setFieldValue('conditionOut', ev.target.value)
                  }
                >
                  {Conditions.map((v, i) => (
                    <MenuItem value={v} key={i}>
                      {v}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Field
                component={TextField}
                type="number"
                fullWidth
                label={
                  <FormattedMessage
                    id={'Amount in'}
                    defaultMessage={'Amount In'}
                  />
                }
                InputProps={{ min: 0 }}
                name="amountOut"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display={'flex'} justifyContent={'flex-end'}>
                <Button onClick={() => resetForm()}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
