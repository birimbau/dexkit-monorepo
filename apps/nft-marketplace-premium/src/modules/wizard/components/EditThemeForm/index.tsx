import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  SupportedColorScheme,
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ThemeFormType } from '../../types';
import FormikMuiColorInput from '../FormikMuiColorInput';
import SelectThemeSection from './SelectThemeSection';

function FormChangeListener({
  values,
  onChange,
}: {
  onChange: (values: ThemeFormType) => void;
  values: ThemeFormType;
}) {
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return null;
}

export interface EditThemeFormProps {
  mode: SupportedColorScheme;
  onChange: (values: ThemeFormType) => void;
}

export default function EditThemeForm({ mode, onChange }: EditThemeFormProps) {
  const handleSubmit = async (values: ThemeFormType) => {};

  return (
    <Formik
      initialValues={{
        primary: '',
        secondary: '',
        text: '',
        background: '',
        success: '',
        error: '',
        warning: '',
        info: '',
        themeId: 'default-theme',
      }}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <>
          <FormChangeListener values={values} onChange={onChange} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <FormattedMessage id="themes" defaultMessage="Themes" />
              </Typography>
              <SelectThemeSection mode={mode} />
            </Grid>
            {values.themeId === 'custom' && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight="bold">
                          <FormattedMessage
                            id="general"
                            defaultMessage="General"
                          />
                        </Typography>
                      </AccordionSummary>
                      <Divider />
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="primary.color"
                                  defaultMessage="Primary color"
                                />
                              }
                              name="primary"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="secondary.color"
                                  defaultMessage="Secondary color"
                                />
                              }
                              name="secondary"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="background.color"
                                  defaultMessage="Background Color"
                                />
                              }
                              name="background"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="text.color"
                                  defaultMessage="Text Color"
                                />
                              }
                              name="text"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight="bold">
                          <FormattedMessage
                            id="advanced"
                            defaultMessage="Advanced"
                          />
                        </Typography>
                      </AccordionSummary>
                      <Divider />
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="success.color"
                                  defaultMessage="Success color"
                                />
                              }
                              name="success"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="error.color"
                                  defaultMessage="Error color"
                                />
                              }
                              name="error"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="info.color"
                                  defaultMessage="Info Color"
                                />
                              }
                              name="info"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="warning.color"
                                  defaultMessage="Warning Color"
                                />
                              }
                              name="warning"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Formik>
  );
}
