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

import { AppDialogTitle } from '../../../../components/AppDialogTitle';

import { Grid, LinearProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useCallback, useMemo } from 'react';
import { AppPage, MenuTree } from '../../../../types/config';
import { CORE_PAGES } from '../../constants';

const MenuOptionsSchema = Yup.object().shape({
  name: Yup.string().required(),
  href: Yup.string().when('type', {
    is: 'External',
    then: (schema) => schema.url().required(),
    otherwise: (schema) => schema.optional(),
  }),
  type: Yup.string().oneOf(['Page', 'Menu', 'External']),
});

interface EditMenuPageDialogProps {
  onCancel: () => void;
  value?: MenuTree;
  onSubmit: (item: MenuTree, fatherIndex?: number) => void;
  dialogProps: DialogProps;
  pages: {
    [key: string]: AppPage;
  };
  fatherIndex?: number;
  disableMenu?: boolean;
}

export default function EditMenuPageDialog({
  onCancel,
  onSubmit,
  dialogProps,
  pages,
  fatherIndex,
  disableMenu,
  value,
}: EditMenuPageDialogProps) {
  const { onClose } = dialogProps;
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  const allPages = useMemo(() => {
    return { ...pages, ...CORE_PAGES };
  }, [pages]);

  const pageKeys = Object.keys(allPages);

  const getInitials = useCallback(() => {
    if (value) {
      if (value.type === 'Page') {
        const page = allPages[value.name.toLocaleLowerCase()];

        if (page) {
          return {
            ...value,
            type: 'Page',
            name: page.title?.toLocaleLowerCase() || '',
            href: page.uri || '',
          } as MenuTree;
        }
      }
      if (value.type === 'External' || value.type === 'Menu') {
        return { ...value };
      }
    }

    return {
      type: 'Page',
      href: '',
      name: pageKeys[0] || '',
    };
  }, [allPages, value]);

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
        key={JSON.stringify(getInitials())}
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
        initialValues={getInitials()}
        validationSchema={MenuOptionsSchema}
      >
        {({ submitForm, isSubmitting, isValid, values, errors }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Field
                    component={Select}
                    name="type"
                    disabled={values.type === 'Menu'}
                    label={<FormattedMessage id="type" defaultMessage="Type" />}
                  >
                    <MenuItem value="Page">
                      <FormattedMessage id="page" defaultMessage="Page" />
                    </MenuItem>

                    {!disableMenu && (
                      <MenuItem value="Menu">
                        <FormattedMessage id="menu" defaultMessage="Menu" />
                      </MenuItem>
                    )}

                    <MenuItem value="External">
                      <FormattedMessage
                        id="external"
                        defaultMessage="External"
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
                        <FormattedMessage id="name" defaultMessage="Name" />
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
                        <FormattedMessage id="name" defaultMessage="Name" />
                      }
                    />
                  </Grid>
                )}
                {values.type === 'External' && (
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="href"
                      label={<FormattedMessage id="url" defaultMessage="URL" />}
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
