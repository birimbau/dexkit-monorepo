import {
  Button,
  createTheme,
  Divider,
  Grid,
  responsiveFontSizes,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getTheme } from '../../../../theme';
import { AppConfig, AppPage } from '../../../../types/config';
import { BuilderKit } from '../../constants';
import { PagesContainer } from '../PagesContainer';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  builderKit?: BuilderKit;
}

export default function PagesWizardContainer({
  config,
  onSave,
  builderKit,
}: Props) {
  const [currentPage, setCurrentPage] = useState<AppPage>(config.pages['home']);
  const [pages, setPages] = useState<{ [key: string]: AppPage }>(config.pages);
  useEffect(() => {
    if (config && !currentPage) {
      setCurrentPage(currentPage);
    }
    if (config && !pages) {
      setPages(config.pages);
    }
  }, [config]);

  const selectedTheme = useMemo(() => {
    if (config.theme !== undefined) {
      if (config.theme === 'custom' && config.customTheme) {
        return responsiveFontSizes(createTheme(JSON.parse(config.customTheme)));
      }

      return responsiveFontSizes(getTheme({ name: config.theme }).theme);
    }
  }, [config.customTheme, config.theme]);

  const handleSave = () => {
    const newConfig = { ...config, pages };
    onSave(newConfig);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="pages" defaultMessage="Pages" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="edit.page.sections"
              defaultMessage="Edit page sections"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {currentPage && pages && (
          <PagesContainer
            builderKit={builderKit}
            pages={pages}
            currentPage={currentPage}
            setPages={setPages}
            setCurrentPage={setCurrentPage}
            theme={selectedTheme}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSave}>
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
