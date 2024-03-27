import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { FieldArray, Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

import { DexkitApiProvider } from '@dexkit/core/providers';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import * as Yup from 'yup';
import { ShowCaseParams } from '../../../types/section';
import ShowCaseFormItem from './ShowCaseFormItem';

import ViewStreamIcon from '@mui/icons-material/ViewStream';

const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'), {
  ssr: false,
});

const FormSchema = Yup.object({
  interval: Yup.number().min(1).max(10000).required(),
  textColor: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color')
    .optional(),
  height: Yup.object({
    mobile: Yup.number().min(100).max(250),
    desktop: Yup.number().min(250).max(500),
  }),
  slides: Yup.array()
    .min(1)
    .of(
      Yup.object({
        textColor: Yup.string()
          .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color')
          .optional(),
        title: Yup.string().optional(),
        imageUrl: Yup.string().required(),
        subtitle: Yup.string().optional(),
        action: Yup.object({
          type: Yup.string(),
          url: Yup.string().url(),
        }).optional(),
      })
    ),
});

export interface AddShowCaseSectionFormProps {
  data?: ShowCaseParams;
  onChange: (data: ShowCaseParams) => void;
  onSave: (data: ShowCaseParams) => void;
  saveOnChange?: boolean;
  disableButtons?: boolean;
}

export default function AddShowCaseSectionForm({
  data,
  onChange,
  onSave,
  saveOnChange,
  disableButtons,
}: AddShowCaseSectionFormProps) {
  const handleSubmit = (values: ShowCaseParams) => {
    onSave(values);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState(-1);

  const handleSelectImage = (index: number) => {
    return () => {
      setIndex(index);
      setOpenDialog(true);
    };
  };

  const handleClose = () => {
    setIndex(-1);
    setOpenDialog(false);
  };

  return (
    <>
      <Formik
        initialValues={
          data
            ? data
            : {
                items: [],
              }
        }
        onSubmit={handleSubmit}
        validationSchema={FormSchema}
        validate={(values: ShowCaseParams) => {
          if (saveOnChange) {
            onChange(values);
          }
        }}
        validateOnChange
      >
        {({ submitForm, isValid, values, isSubmitting, setFieldValue }) => (
          <>
            <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
              <MediaDialog
                dialogProps={{
                  open: openDialog,
                  maxWidth: 'lg',
                  fullWidth: true,
                  onClose: handleClose,
                }}
                onConfirmSelectFile={(file) =>
                  setFieldValue(`items[${index}].imageUrl`, file.url)
                }
              />
            </DexkitApiProvider.Provider>
            <Grid container spacing={2}>
              {values.items.length === 0 && (
                <Grid item xs={12}>
                  <Paper>
                    <Stack
                      sx={{ p: 2 }}
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                    >
                      <ViewStreamIcon fontSize="large" />
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="add.items"
                            defaultMessage="Add items"
                          />
                        </Typography>
                        <Typography
                          color="text.secondary"
                          align="center"
                          variant="body1"
                        >
                          <FormattedMessage
                            id="section.addItemsPrompt"
                            defaultMessage="Please add items to the section below."
                          />
                        </Typography>
                      </Box>
                      <FieldArray
                        name="items"
                        render={(arrayHelpers) => (
                          <Button
                            onClick={arrayHelpers.handlePush({
                              type: 'image',
                              url: '',
                            })}
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="add.item"
                              defaultMessage="Add item"
                            />
                          </Button>
                        )}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <FieldArray
                  name="items"
                  render={(arrayHelpers) => (
                    <Grid container spacing={2}>
                      {values.items.map((_, index, arr) => (
                        <Grid item xs={12} key={index}>
                          <Paper sx={{ p: 2 }}>
                            <ShowCaseFormItem
                              index={index}
                              onUp={arrayHelpers.handleSwap(index, index - 1)}
                              onDown={arrayHelpers.handleSwap(index, index + 1)}
                              onRemove={arrayHelpers.handleRemove(index)}
                              disableDown={index === arr.length - 1}
                              disableUp={index === 0}
                              onSelectImage={handleSelectImage(index)}
                            />
                          </Paper>
                        </Grid>
                      ))}
                      {values.items.length > 0 && (
                        <Grid item xs={12}>
                          <Button
                            onClick={arrayHelpers.handlePush({
                              type: 'image',
                              url: '',
                            })}
                            variant="outlined"
                          >
                            <FormattedMessage id="add" defaultMessage="Add" />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  )}
                />
              </Grid>
              {!disableButtons && (
                <Grid item xs={12}>
                  <Button
                    disabled={!isValid || isSubmitting}
                    variant="contained"
                    onClick={submitForm}
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Formik>
    </>
  );
}
