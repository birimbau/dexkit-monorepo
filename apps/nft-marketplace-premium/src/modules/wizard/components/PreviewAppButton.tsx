import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppConfig } from 'src/types/config';
import { customThemeAtom } from '../state';
import { generateTheme } from '../utils';
const PreviewPageDialog = dynamic(() => import('./dialogs/PreviewPageDialog'));

interface Props {
  appConfig?: AppConfig;
}

export function PreviewAppButton({ appConfig }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const customTheme = useAtomValue(customThemeAtom);
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const selectedTheme = useMemo(() => {
    return generateTheme({
      selectedFont: appConfig?.font,
      customTheme,
      selectedThemeId: appConfig?.theme || '',
    });
  }, [appConfig?.theme, customTheme, appConfig?.font]);

  return (
    <>
      <ThemeProvider theme={selectedTheme}>
        <PreviewPageDialog
          dialogProps={{
            open: showPreview,
            maxWidth: 'xl',
            fullWidth: true,
            onClose: handleClosePreview,
          }}
          appConfig={appConfig}
          disabled={true}
          sections={appConfig?.pages['home']?.sections}
          name={'Home'}
          withLayout={true}
        />
      </ThemeProvider>
      <Button
        onClick={handleShowPreview}
        size="small"
        variant="outlined"
        className={'preview-app-button'}
      >
        <FormattedMessage id="preview.app" defaultMessage="Preview App" />
      </Button>
    </>
  );
}
