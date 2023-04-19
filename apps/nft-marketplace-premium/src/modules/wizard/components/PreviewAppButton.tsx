import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useThemeMode } from 'src/hooks/app';
import { AppConfig } from 'src/types/config';
import {
  customThemeAtom,
  customThemeDarkAtom,
  customThemeLightAtom,
} from '../state';
import { generateTheme } from '../utils';
const PreviewPageDialog = dynamic(() => import('./dialogs/PreviewPageDialog'));

interface Props {
  appConfig?: AppConfig;
}

export function PreviewAppButton({ appConfig }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const { mode } = useThemeMode();
  const customTheme = useAtomValue(customThemeAtom);
  const customThemeDark = useAtomValue(customThemeDarkAtom);
  const customThemeLight = useAtomValue(customThemeLightAtom);
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const selectedTheme = useMemo(() => {
    return generateTheme({
      selectedFont: appConfig?.font,
      customTheme: {
        colorSchemes: {
          dark: {
            ...customThemeDark,
          },
          light: {
            ...customThemeLight,
          },
        },
      },
      selectedThemeId: appConfig?.theme || '',
      mode,
    });
  }, [appConfig?.theme, appConfig?.font]);

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
