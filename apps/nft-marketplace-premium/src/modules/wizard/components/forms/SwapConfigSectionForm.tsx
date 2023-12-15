import { Button, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  AppPageSection,
  SwapLiFiPageSection,
  SwapPageSection,
} from '../../types/section';

import { useAppWizardConfig } from '../../hooks';
import { SwapConfigForm } from './SwapConfigForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  type: 'swap' | 'swap-lifi';
  section?: SwapPageSection | SwapLiFiPageSection;
}
export function SwapConfigSectionForm({
  onSave,
  onCancel,
  onChange,
  type = 'swap',
  section,
}: Props) {
  const [data, setData] = useState(section?.config);
  const { wizardConfig } = useAppWizardConfig();
  useEffect(() => {
    onChange({
      type,
      config: data,
    });
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SwapConfigForm
          data={data}
          onChange={(d) => setData(d)}
          featuredTokens={
            wizardConfig?.tokens ? wizardConfig?.tokens[0].tokens : undefined
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button
            onClick={() =>
              onSave({
                type,
                config: data,
              })
            }
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
          <Button onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
