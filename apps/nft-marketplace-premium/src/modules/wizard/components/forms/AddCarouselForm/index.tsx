import { Button, Grid, Paper } from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import SlideItem from './SlideItem';

import { CarouselPageSection } from '@/modules/wizard/types/section';
import * as Yup from 'yup';

const FormSchema = Yup.object({
  interval: Yup.number().min(1).max(10000).required(),
  slides: Yup.array()
    .min(1)
    .of(
      Yup.object({
        title: Yup.string().required(),
        subtitle: Yup.string().optional(),
        action: Yup.object({
          type: Yup.string(),
          url: Yup.string().url(),
        }).required(),
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
}

export default function AddCarouselForm({
  data,
  onChange,
  onSave,
  saveOnChange,
}: AddCarouselFormProps) {
  const handleSubmit = (values: CarouselFormType) => {
    onSave({ settings: values, type: 'carousel' });
  };

  return (
    <Formik
      initialValues={data ? data.settings : { interval: 5000, slides: [] }}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
      validate={(values: CarouselFormType) => {
        if (saveOnChange) {
          onChange({ settings: values, type: 'carousel' });
        }
      }}
    >
      {({ submitForm, isValid, values, isSubmitting }) => (
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
                  {values.slides.map((_, index) => (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2 }}>
                        <SlideItem index={index} />
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
          <Grid item xs={12}>
            <Button
              disabled={!isValid || isSubmitting}
              variant="contained"
              onClick={submitForm}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
