import { ThemeMode } from '@dexkit/ui/constants/enum';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { MuiColorInput } from 'mui-color-input';
import { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { customThemeDarkAtom, customThemeLightAtom } from '../state';

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
      if (legacyThemeParsed?.pallete?.mode === ThemeMode.dark) {
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
  }, [mode, customThemeLight, customThemeDark]);

  const setActiveTheme = useMemo(() => {
    if (mode === ThemeMode.dark) {
      return setCustomThemeDark;
    } else {
      return setCustomThemeLight;
    }
  }, [mode, setCustomThemeLight, setCustomThemeDark]);

  return (
    <Stack spacing={2}>
      <Box sx={{ width: '100%' }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight="bold">
              <FormattedMessage id="general" defaultMessage="General" />
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails sx={{ py: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  format="hex"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="primary.color"
                      defaultMessage="Primary color"
                    />
                  }
                  value={activeTheme?.palette?.primary?.main || '#000'}
                  onChange={(color) => {
                    setActiveTheme({
                      palette: {
                        ...activeTheme?.palette,

                        primary: {
                          main: color,
                        },
                      },
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  fullWidth
                  format="hex"
                  label={
                    <FormattedMessage
                      id="secondary.color"
                      defaultMessage="Secondary color"
                    />
                  }
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  format="hex"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="background.color"
                      defaultMessage="Background color"
                    />
                  }
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  label={
                    <FormattedMessage
                      id="text.color"
                      defaultMessage="Text color"
                    />
                  }
                  fullWidth
                  format="hex"
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
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight="bold">
              <FormattedMessage id="advanced" defaultMessage="Advanced" />
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails sx={{ py: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  format="hex"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="primary.color"
                      defaultMessage="Primary color"
                    />
                  }
                  value={activeTheme?.palette?.primary?.main || '#000'}
                  onChange={(color) => {
                    setActiveTheme({
                      palette: {
                        ...activeTheme?.palette,
                        primary: {
                          main: color,
                        },
                      },
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  fullWidth
                  format="hex"
                  label={
                    <FormattedMessage
                      id="secondary.color"
                      defaultMessage="Secondary color"
                    />
                  }
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  format="hex"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="background.color"
                      defaultMessage="Background color"
                    />
                  }
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiColorInput
                  label={
                    <FormattedMessage
                      id="text.color"
                      defaultMessage="Text color"
                    />
                  }
                  fullWidth
                  format="hex"
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
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}

export default WizardThemeCustom;
