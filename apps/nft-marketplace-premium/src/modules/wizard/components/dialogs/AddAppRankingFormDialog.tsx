import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { useAddAppRankingMutation } from '../../hooks';

import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import SendAddAppRankingDialog from './SendAddAppRankingDialog';

interface Props {
  dialogProps: DialogProps;
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
  dialogProps,
  siteId,
  title,
  description,
  rankingId,
}: Props) {
  const { onClose } = dialogProps;
  const [open, setOpen] = useState(false);
  const mutationAddRanking = useAddAppRankingMutation();
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

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

      <Dialog {...dialogProps}>
        <AppDialogTitle
          title={
            <FormattedMessage
              id="add.app.ranking"
              defaultMessage="Add app ranking"
            />
          }
          onClose={handleClose}
        />

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
          {({ submitForm, values, setFieldValue }) => (
            <Form>
              <DialogContent dividers>
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
                              inputRef={ref}
                              component={TextField}
                              name="title"
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
                              name="description"
                              InputProps={{
                                endAdornment: inputAdornment('end'),
                              }}
                              label={
                                <FormattedMessage
                                  id={'description'}
                                  defaultMessage={'Description'}
                                />
                              }
                              inputRef={ref}
                            />
                          )}
                        </CompletationProvider>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
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
                      onClick={handleClose}
                    >
                      <FormattedMessage id="cancel" defaultMessage="cancel" />
                    </Button>
                  </Stack>
                </Grid>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
