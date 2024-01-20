import { useAddAppRankingMutation } from '@/modules/wizard/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import SendAddAppRankingDialog from '../../dialogs/SendAddAppRankingDialog';

interface Props {
  siteId?: number;
  rankingId?: number;
  description?: string;
  title?: string;
}

interface AddRanking {
  title?: string;
  description?: string;
}

const AddRankingSchema: Yup.SchemaOf<AddRanking> = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string(),
});

export default function AddRankingFormDialog({
  siteId,
  title,
  description,
  rankingId,
}: Props) {
  const [open, setOpen] = useState(false);
  const mutationAddRanking = useAddAppRankingMutation();

  return (
    <>
      {open && (
        <SendAddAppRankingDialog
          dialogProps={{
            open: open,
            onClose: () => {
              setOpen(false);
              mutationAddRanking.reset();
            },
          }}
          isLoading={mutationAddRanking.isLoading}
          isSuccess={mutationAddRanking.isSuccess}
          error={mutationAddRanking.error}
        />
      )}

      <Formik
        initialValues={{
          title: title ? title : '',
          description: description ? description : undefined,
        }}
        validationSchema={AddRankingSchema}
        onSubmit={(value, helper) => {
          setOpen(true);
          mutationAddRanking.mutate({
            siteId,
            rankingId,
            title: value?.title,
            description: value?.description,
          });
          helper.setSubmitting(false);
        }}
      >
        {({ submitForm, resetForm }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Stack spacing={2}>
                    <Field
                      component={TextField}
                      name="title"
                      label={
                        <FormattedMessage
                          id={'title'}
                          defaultMessage={'Title'}
                        />
                      }
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Stack spacing={2}>
                    <Field
                      component={TextField}
                      name="description"
                      label={
                        <FormattedMessage
                          id={'description'}
                          defaultMessage={'Description'}
                        />
                      }
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => resetForm()}
                >
                  <FormattedMessage id="cancel" defaultMessage="cancel" />
                </Button>
              </Stack>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
