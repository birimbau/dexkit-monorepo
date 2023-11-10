import { Button, Divider, Grid, Stack, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';
import InputInfoAdornment from '../InputInfoAdornment';

export interface DomainSectionForm {
  domain: string;
}

const FormSchema: Yup.SchemaOf<DomainSectionForm> = Yup.object().shape({
  domain: Yup.string().url().required(),
});

interface Props {
  isEdit?: boolean;
  initialValues?: DomainSectionForm;
  onSubmit?: (form: DomainSectionForm) => void;
}

export default function DomainSection({
  onSubmit,
  initialValues,
  isEdit,
}: Props) {
  const [isEditing, setIsEditing] = useState(true);

  const handleSubmit = useCallback(
    (
      values: DomainSectionForm,
      formikHelpers: FormikHelpers<DomainSectionForm>,
    ) => {
      if (onSubmit) {
        onSubmit(values);
        setIsEditing(false);
      }
    },
    [onSubmit],
  );

  const formik = useFormik<DomainSectionForm>({
    initialValues: initialValues || {
      domain: '',
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  return (
    <>
      <Stack>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{ maxWidth: '400px' }}
                fullWidth
                disabled={!isEditing || isEdit}
                label={<FormattedMessage id="url" defaultMessage="Domain" />}
                name="domain"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.domain}
                error={Boolean(formik.errors.domain) && formik.touched.domain}
                helperText={
                  Boolean(formik.errors.domain) && formik.touched.domain
                    ? formik.errors.domain
                    : undefined
                }
                InputProps={{
                  endAdornment: <InputInfoAdornment field={'domain'} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  disabled={!formik.isValid}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
}
