import { ThemeMode } from '@dexkit/ui/constants/enum';
import { Box, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { MuiColorInput } from 'mui-color-input';
import { useEffect, useMemo } from 'react';
import { customThemeDarkAtom, customThemeLightAtom } from '../state';
import { TooltipInfo } from './InputInfoAdornment';

interface Props {
  mode?: ThemeMode;
  legacyTheme?: string;
}

function WizardThemeCustom({ mode, legacyTheme }: Props) {
  const [customThemeLight, setCustomThemeLight] = useAtom(customThemeLightAtom);
  const [customThemeDark, setCustomThemeDark] = useAtom(customThemeDarkAtom);
  // TODO: delete this after users migrate to new theme
  // Migration step from legacy theme to multi theme. On mount we set accordingly the theme and then delete it from
  // config
  useEffect(() => {
    if (legacyTheme) {
      const legacyThemeParsed = JSON.parse(legacyTheme);
      if (legacyThemeParsed?.pallete.mode === ThemeMode.dark) {
        setCustomThemeDark({
          palette: {
            ...legacyThemeParsed?.palette,
          },
        });
      } else {
        setCustomThemeLight({
          palette: {
            ...legacyThemeParsed?.palette,
          },
        });
      }
    }
  }, []);

  const activeTheme = useMemo(() => {
    if (mode === ThemeMode.dark) {
      return customThemeDark;
    } else {
      return customThemeLight;
    }
  }, [mode, customThemeLightAtom, customThemeDarkAtom]);

  const setActiveTheme = useMemo(() => {
    if (mode === ThemeMode.dark) {
      return setCustomThemeDark;
    } else {
      return setCustomThemeLight;
    }
  }, [mode, setCustomThemeLight, setCustomThemeDark]);

  return (
    <Stack spacing={0.5} justifyContent="flex-start" alignItems="flex-start">
      <Box display={'flex'} justifyContent={'center'}>
        <MuiColorInput
          value={activeTheme?.palette?.primary?.main || '#000'}
          onChange={(color) =>
            setActiveTheme({
              palette: {
                ...activeTheme?.palette,
                primary: {
                  main: color,
                },
              },
            })
          }
        />
        <TooltipInfo field={'custom.primary.color'} />
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        <MuiColorInput
          value={activeTheme?.palette?.secondary?.main || '#000'}
          onChange={(color) =>
            setActiveTheme({
              palette: {
                ...activeTheme?.palette,
                secondary: {
                  main: color,
                },
              },
            })
          }
        />
        <TooltipInfo field={'custom.secondary.color'} />
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        <MuiColorInput
          value={activeTheme?.palette?.background?.default || '#000'}
          onChange={(color) =>
            setActiveTheme({
              palette: {
                ...activeTheme?.palette,
                background: {
                  default: color,
                },
              },
            })
          }
        />
        <TooltipInfo field={'custom.background.default.color'} />
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        <MuiColorInput
          value={activeTheme?.palette?.text?.primary || '#000'}
          onChange={(color) =>
            setActiveTheme({
              palette: {
                ...activeTheme?.palette,
                text: {
                  primary: color,
                },
              },
            })
          }
        />
        <TooltipInfo field={'custom.text.primary.color'} />
      </Box>
    </Stack>
  );
}

export default WizardThemeCustom;
