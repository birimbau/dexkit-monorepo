import { Divider, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppConfig } from '../../../../types/config';
import { StepperButtonProps } from '../../types';
import GeneralSection, { GeneralSectionForm } from '../sections/GeneralSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function GeneralWizardContainer({
  config,
  onSave,
  onChange,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const [generalData, setGeneralData] = useState<GeneralSectionForm>();
  const handleSubmitGeneral = (form: GeneralSectionForm) => {
    setGeneralData(form);
    if (form) {
      const newConfig = {
        ...config,
        name: form.name,
        email: form.email,
        favicon_url: form.faviconUrl,
        currency: form.currency,
        logo: {
          url: form.logoUrl,
        },
        locale: form.locale,
      };
      onSave(newConfig);
    }
  };

  const onChangeGeneral = (form: GeneralSectionForm) => {
    if (form) {
      const newConfig = {
        ...config,
        name: form.name,
        email: form.email,
        favicon_url: form.faviconUrl,
        currency: form.currency,
        logo: {
          url: form.logoUrl,
        },
        logoDark: {
          url: form?.logoDarkUrl,
        },
        locale: form.locale,
      };
      onChange(newConfig);
    }
  };

  useEffect(() => {
    if (config) {
      setGeneralData({
        currency: config.currency,
        email: config.email,
        faviconUrl: config.favicon_url || '',
        locale: config.locale || '',
        logoUrl: config.logo?.url || '',
        logoDarkUrl: config.logoDark?.url || '',
        name: config.name,
      });
    }
  }, [config]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="general" defaultMessage="General" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="general.information"
              defaultMessage="General information"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <GeneralSection
          initialValues={generalData}
          onChange={onChangeGeneral}
          onSubmit={handleSubmitGeneral}
          isOnStepper={isOnStepper}
          stepperButtonProps={stepperButtonProps}
        />
      </Grid>
    </Grid>
  );
}
