import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import * as Yup from 'yup';
import slugify from 'slugify';

import { AppDialogTitle } from '../../../../components/AppDialogTitle';

import { Grid, LinearProgress } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { AppPageOptions } from '../../../../types/config';

interface PageOptions {
  title: string;
}

const PageOptionsSchema: Yup.SchemaOf<PageOptions> = Yup.object().shape({
  title: Yup.string().required(),
});

interface Props {
  onCancel: () => void;
  onSubmit: (item: AppPageOptions) => void;
  clonedPage?: {
    key?: string;
    title?: string;
  };
  item?: PageOptions;
  dialogProps: DialogProps;
}

export default function AddPageDialog({
  item,
  onCancel,
  onSubmit,
  clonedPage,
  dialogProps,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="create.page" defaultMessage="Create page" />
        }
        onClose={handleClose}
      />
      <Formik
        initialValues={{ ...item }}
        onSubmit={(values, helpers) => {
          if (values.title === 'Home') {
            helpers.setFieldError(
              'title',
              formatMessage({
                id: 'use.home.as.title.not.allowed',
                defaultMessage: 'Use Home as title is not allowed for pages',
              })
            );
            return;
          }

          onSubmit({
            title: values.title as string,
            uri: `/${slugify(values.title as string).toLowerCase()}`,
            key: slugify(values.title as string).toLowerCase(),
            clonedPageKey: clonedPage?.key,
          });
          handleClose();
        }}
        validationSchema={PageOptionsSchema}
      >
        {({ submitForm, isSubmitting, isValid }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                {clonedPage && (
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage
                        id={'you.are.cloning.page.message'}
                        defaultMessage={'You are cloning {page} page'}
                        values={{
                          page: clonedPage.title || '',
                        }}
                      />
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="title"
                    label={
                      <FormattedMessage id={'title'} defaultMessage={'Title'} />
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {isSubmitting && <LinearProgress />}
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  disabled={!isValid || isSubmitting}
                  variant="contained"
                  onClick={submitForm}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
