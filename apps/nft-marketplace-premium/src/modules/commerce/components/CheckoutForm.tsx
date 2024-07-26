import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from '@mui/material';
import { Field, FieldArray, useFormikContext } from 'formik';
import { Checkbox, TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { CheckoutItemType } from '../types';
import CheckoutItemsTable from './CheckoutItemsTable';

export default function CheckoutForm() {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          label={<FormattedMessage id="title" defaultMessage="Title" />}
          component={TextField}
          name="title"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          label={
            <FormattedMessage id="description" defaultMessage="description" />
          }
          component={TextField}
          name="description"
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Field component={Checkbox} type="checkbox" name="requireEmail" />
            }
            label="Require email"
          />
          <FormControlLabel
            control={
              <Field
                component={Checkbox}
                type="checkbox"
                name="requireAddress"
              />
            }
            label="Require account"
          />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <CheckoutItemsTable name="items" />
      </Grid>
      <Grid item xs={12}>
        <FieldArray
          name="items"
          render={({ handlePush }) => (
            <Button
              variant="outlined"
              onClick={handlePush({
                productId: '',
                quantity: 1,
              } as CheckoutItemType)}
            >
              <FormattedMessage id="add.item" defaultMessage="Add item" />
            </Button>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Stack justifyContent="flex-end" direction="row" spacing={2}>
            <Button>
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              onClick={submitForm}
              disabled={!isValid || isSubmitting}
              variant="contained"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
