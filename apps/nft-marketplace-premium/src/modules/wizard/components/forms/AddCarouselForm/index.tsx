import { Button, Grid, Paper } from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import SlideItem from './SlideItem';

import { CarouselPageSection } from '@/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import * as Yup from 'yup';

const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'), {
  ssr: false,
});

const FormSchema = Yup.object({
  interval: Yup.number().min(1).max(10000).required(),
  slides: Yup.array()
    .min(1)
    .of(
      Yup.object({
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

interface CarouselFormType {
  interval?: number;
  slides: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    action?: {
      caption: string;
      url: string;
      action: string;
    };
  }[];
}

export interface AddCarouselFormProps {
  data?: CarouselPageSection;
  onChange: (data: CarouselPageSection) => void;
  onSave: (data: CarouselPageSection) => void;
  saveOnChange?: boolean;
  disableButtons?: boolean;
}

export default function AddCarouselForm({
  data,
  onChange,
  onSave,
  saveOnChange,
  disableButtons,
}: AddCarouselFormProps) {
  const handleSubmit = (values: CarouselFormType) => {
    onSave({ settings: values, type: 'carousel' });
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
        initialValues={data ? data.settings : { interval: 5000, slides: [] }}
        onSubmit={handleSubmit}
        validationSchema={FormSchema}
        validate={(values: CarouselFormType) => {
          if (saveOnChange) {
            onChange({ settings: values, type: 'carousel' });
          }
        }}
        validateOnChange
      >
        {({ submitForm, isValid, values, isSubmitting, setFieldValue }) => (
          <>
            <MediaDialog
              dialogProps={{
                open: openDialog,
                maxWidth: 'lg',
                fullWidth: true,
                onClose: handleClose,
              }}
              onConfirmSelectFile={(file) =>
                setFieldValue(`slides[${index}].imageUrl`, file.url)
              }
            />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  label={
                    <FormattedMessage id="interval" defaultMessage="Interval" />
                  }
                  fullWidth
                  component={TextField}
                  type="number"
                  name="interval"
                />
              </Grid>
              <Grid item xs={12}>
                <FieldArray
                  name="slides"
                  render={(arrayHelpers) => (
                    <Grid container spacing={2}>
                      {values.slides.map((_, index, arr) => (
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2 }}>
                            <SlideItem
                              index={index}
                              onRemove={arrayHelpers.handleRemove(index)}
                              onSelectImage={handleSelectImage(index)}
                              onUp={arrayHelpers.handleSwap(index, index - 1)}
                              onDown={arrayHelpers.handleSwap(index, index + 1)}
                              disableUp={index === 0}
                              disableDown={index === arr.length - 1}
                            />
                          </Paper>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={arrayHelpers.handlePush({
                            type: 'link',
                            url: '',
                          })}
                          variant="outlined"
                        >
                          <FormattedMessage id="add" defaultMessage="Add" />
                        </Button>
                      </Grid>
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
