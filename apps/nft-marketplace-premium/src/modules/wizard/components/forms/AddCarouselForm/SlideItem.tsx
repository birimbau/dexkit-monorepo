import Grid from '@mui/material/Grid';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface SlideItemProps {
  index: number;
}

export default function SlideItem({ index }: SlideItemProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          component={TextField}
          fullWidth
          name={`slides[${index}].title`}
          label={<FormattedMessage id="title" defaultMessage="Title" />}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          component={TextField}
          fullWidth
          name={`slides[${index}].subtitle`}
          label={<FormattedMessage id="subtitle" defaultMessage="subtitle" />}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="image.url" defaultMessage="Image URL" />}
          name={`slides[${index}].imageUrl`}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="url" defaultMessage="URL" />}
          name={`slides[${index}].action.url`}
        />
      </Grid>
    </Grid>
  );
}
