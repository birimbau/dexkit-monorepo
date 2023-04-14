import { Box, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { MuiColorInput } from 'mui-color-input';
import { customThemeAtom } from '../state';
import { TooltipInfo } from './InputInfoAdornment';

function WizardThemeCustom() {
  const [customTheme, setCustomTheme] = useAtom(customThemeAtom);

  return (
    <Stack spacing={0.5} justifyContent="flex-start" alignItems="flex-start">
      <Box display={'flex'} justifyContent={'center'}>
        <MuiColorInput
          value={customTheme?.palette?.primary?.main || '#000'}
          onChange={(color) =>
            setCustomTheme({
              palette: {
                ...customTheme?.palette,
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
          value={customTheme?.palette?.secondary?.main || '#000'}
          onChange={(color) =>
            setCustomTheme({
              palette: {
                ...customTheme?.palette,
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
          value={customTheme?.palette?.background?.default || '#000'}
          onChange={(color) =>
            setCustomTheme({
              palette: {
                ...customTheme?.palette,
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
          value={customTheme?.palette?.text?.primary || '#000'}
          onChange={(color) =>
            setCustomTheme({
              palette: {
                ...customTheme?.palette,
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
