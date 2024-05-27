import { AppConfig, AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Divider,
  Grid,
  Stack,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getTheme } from '../../../../theme';
import { BuilderKit } from '../../constants';
import { PagesContainer } from '../PagesContainer';

import dynamic from 'next/dynamic';

const ApiKeyIntegrationDialog = dynamic(
  () => import('../dialogs/ApiKeyIntegrationDialog')
);

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  builderKit?: BuilderKit;
  onHasChanges: (hasChanges: boolean) => void;
  siteId?: number;
  previewUrl?: string;
}

export default function PagesWizardContainer({
  config,
  siteId,
  onSave,
  builderKit,
  onHasChanges,
  previewUrl,
}: Props) {
  const [currentPage, setCurrentPage] = useState<AppPage>(config.pages['home']);
  const [pages, setPages] = useState<{ [key: string]: AppPage }>(config.pages);
  const [showAddPage, setShowAddPage] = useState(false);
  useEffect(() => {
    if (config && !currentPage) {
      setCurrentPage(currentPage);
    }
    if (config && !pages) {
      setPages(config.pages);
    }
  }, [config]);

  const pagesChanged = useMemo(() => {
    if (config.pages !== pages) {
      return true;
    } else {
      return false;
    }
  }, [config.pages, pages]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(pagesChanged);
    }
  }, [onHasChanges, pagesChanged]);

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

  const handleShowAddPage = () => {
    setShowAddPage(true);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {pages && (
            <PagesContainer
              builderKit={builderKit}
              pages={pages}
              currentPage={currentPage}
              setPages={setPages}
              setCurrentPage={setCurrentPage}
              theme={selectedTheme}
              showAddPage={showAddPage}
              setShowAddPage={setShowAddPage}
              previewUrl={previewUrl}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!pagesChanged}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
