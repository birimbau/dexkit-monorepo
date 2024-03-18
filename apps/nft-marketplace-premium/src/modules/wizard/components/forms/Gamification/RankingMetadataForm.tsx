import { useAddAppRankingMutation } from '@/modules/wizard/hooks';
import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
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

export default function RankingMetadataForm({
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
          isEdit={rankingId !== undefined}
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
        {({ submitForm, resetForm, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Stack spacing={2}>
                    <CompletationProvider
                      onCompletation={(output) =>
                        setFieldValue('title', output)
                      }
                      initialPrompt={values.title}
                    >
                      {({ inputAdornment, ref }) => (
                        <Field
                          component={TextField}
                          name="title"
                          inputRef={ref}
                          InputProps={{
                            endAdornment: inputAdornment('end'),
                          }}
                          label={
                            <FormattedMessage
                              id={'title'}
                              defaultMessage={'Title'}
                            />
                          }
                        />
                      )}
                    </CompletationProvider>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Stack spacing={2}>
                    <CompletationProvider
                      onCompletation={(output) =>
                        setFieldValue('description', output)
                      }
                      initialPrompt={values.description}
                      multiline
                    >
                      {({ inputAdornment, ref }) => (
                        <Field
                          component={TextField}
                          multiline
                          rows={3}
                          name="description"
                          label={
                            <FormattedMessage
                              id={'description'}
                              defaultMessage={'Description'}
                            />
                          }
                          InputProps={{
                            endAdornment: inputAdornment('end'),
                          }}
                          inputRef={ref}
                        />
                      )}
                    </CompletationProvider>
                  </Stack>
                </Box>
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
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
