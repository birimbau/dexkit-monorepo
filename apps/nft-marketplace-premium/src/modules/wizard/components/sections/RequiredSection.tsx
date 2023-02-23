import { Cancel, Edit } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';
import InfoDialog from '../dialogs/FieldInfoDialog';
import InputInfoAdornment from '../InputInfoAdornment';

export interface RequiredSectionForm {
  domain?: string;
  name: string;
  email: string;
}

const FormSchema: Yup.SchemaOf<RequiredSectionForm> = Yup.object().shape({
  domain: Yup.string().url(),
  email: Yup.string().email().required(),
  name: Yup.string().required(),
});

interface Props {
  isEdit?: boolean;
  initialValues?: RequiredSectionForm;
  onSubmit?: (form: RequiredSectionForm) => void;
}

export default function GeneralSection({
  onSubmit,
  initialValues,
  isEdit,
}: Props) {
  const [isEditing, setIsEditing] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);
  const [fieldInfo, setFieldInfo] = useState('name');

  const handleSubmit = useCallback(
    (
      values: RequiredSectionForm,
      formikHelpers: FormikHelpers<RequiredSectionForm>
    ) => {
      if (onSubmit) {
        onSubmit(values);
        setIsEditing(false);
      }
    },
    [onSubmit]
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const formik = useFormik<RequiredSectionForm>({
    initialValues: initialValues || {
      domain: '',
      email: '',
      name: '',
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  return (
    <>
      <InfoDialog
        dialogProps={{ open: openInfo, onClose: () => setOpenInfo(false) }}
        field={fieldInfo}
      />
      <Card>
        <CardContent>
          <Stack>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    disabled={!isEditing}
                    fullWidth
                    name="name"
                    label={<FormattedMessage id="name" defaultMessage="Name" />}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={
                      Boolean(formik.errors.name) && formik.touched.name
                        ? formik.errors.name
                        : undefined
                    }
                    InputProps={{
                      endAdornment: <InputInfoAdornment field={'name'} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={!isEditing}
                    fullWidth
                    type="email"
                    name="email"
                    label={
                      <FormattedMessage id="email" defaultMessage="E-mail" />
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={Boolean(formik.errors.email) && formik.touched.email}
                    helperText={
                      Boolean(formik.errors.email) && formik.touched.email
                        ? formik.errors.email
                        : undefined
                    }
                    InputProps={{
                      endAdornment: <InputInfoAdornment field={'email'} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={!isEditing || isEdit}
                    label={
                      <FormattedMessage id="url" defaultMessage="Domain" />
                    }
                    fullWidth
                    name="domain"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.domain}
                    error={
                      Boolean(formik.errors.domain) && formik.touched.domain
                    }
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
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    {isEditing ? (
                      <>
                        <Button
                          disabled={!formik.isValid}
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          <FormattedMessage id="save" defaultMessage="Save" />
                        </Button>
                        <Button
                          startIcon={<Cancel />}
                          onClick={handleCancelEdit}
                        >
                          <FormattedMessage
                            id="cancel"
                            defaultMessage="Cancel"
                          />
                        </Button>
                      </>
                    ) : null}
                  </Stack>
                </Grid>
              </Grid>
            </form>
            {!isEditing && (
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  startIcon={<Edit />}
                  variant="contained"
                  onClick={handleEdit}
                  type="button"
                >
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
