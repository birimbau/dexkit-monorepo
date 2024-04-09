import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';

import { Grid, LinearProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useMemo } from 'react';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { AppPage, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import { CORE_PAGES } from '../../constants';

const MenuOptionsSchema = Yup.object().shape({
  name: Yup.string().required(),
  href: Yup.string()
    .url()
    .when('type', {
      is: 'External',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema,
    }),
  type: Yup.string().oneOf(['Page', 'Menu', 'External']),
});

interface Props {
  onCancel: () => void;
  onSubmit: (item: MenuTree, fatherIndex?: number) => void;
  dialogProps: DialogProps;
  pages: {
    [key: string]: AppPage;
  };
  fatherIndex?: number;
  disableMenu?: boolean;
}

export default function AddMenuPageDialog({
  onCancel,
  onSubmit,
  dialogProps,
  pages,
  fatherIndex,
  disableMenu,
}: Props) {
  const { onClose } = dialogProps;
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  const isFather = fatherIndex !== undefined;

  const allPages = useMemo(() => {
    return { ...pages, ...CORE_PAGES };
  }, [pages]);

  const pageKeys = Object.keys(allPages);

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          fatherIndex !== undefined ? (
            <FormattedMessage
              id="create.submenu"
              defaultMessage="Create submenu"
            />
          ) : (
            <FormattedMessage id="create.menu" defaultMessage="Create menu" />
          )
        }
        onClose={handleClose}
      />
      <Formik
        onSubmit={(values) => {
          if (values.type === 'Page') {
            onSubmit(
              {
                ...(values as MenuTree),
                name: allPages[values.name].title || '',
                href: allPages[values.name].uri || '',
              },
              fatherIndex
            );
          } else {
            onSubmit(values as MenuTree, fatherIndex);
          }
          handleClose();
        }}
        initialValues={{
          type: 'Page',
          href: '',
          name: pageKeys[0] || '',
        }}
        validationSchema={MenuOptionsSchema}
      >
        {({ submitForm, isSubmitting, isValid, values }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Field
                    component={Select}
                    name="type"
                    label={
                      <FormattedMessage id={'type'} defaultMessage={'Type'} />
                    }
                  >
                    <MenuItem value={'Page'}>
                      <FormattedMessage id={'page'} defaultMessage={'Page'} />
                    </MenuItem>

                    {!disableMenu && (
                      <MenuItem value={'Menu'}>
                        <FormattedMessage id={'menu'} defaultMessage={'Menu'} />
                      </MenuItem>
                    )}

                    <MenuItem value={'External'}>
                      <FormattedMessage
                        id={'external'}
                        defaultMessage={'External'}
                      />
                    </MenuItem>
                  </Field>
                </Grid>
                {values.type === 'Page' && (
                  <Grid item xs={12}>
                    <Field
                      component={Select}
                      name="name"
                      label={
                        <FormattedMessage id={'name'} defaultMessage={'Name'} />
                      }
                    >
                      {pageKeys.map((item, key) => (
                        <MenuItem value={item} key={key}>
                          {allPages[item].title || ''}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                )}

                {values.type !== 'Page' && (
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label={
                        <FormattedMessage id={'name'} defaultMessage={'Name'} />
                      }
                    />
                  </Grid>
                )}
                {values.type === 'External' && (
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="href"
                      label={
                        <FormattedMessage id={'url'} defaultMessage={'URL'} />
                      }
                    />
                  </Grid>
                )}
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
