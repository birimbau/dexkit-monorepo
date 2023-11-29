import { ThemeMode } from '@dexkit/ui/constants/enum';
import { Box, Grid, SupportedColorScheme } from '@mui/material';
import { useField } from 'formik';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getTheme, themes } from 'src/theme';
import { customThemeDarkAtom, customThemeLightAtom } from '../../state';
import WizardThemeButton from '../WizardThemeButton';

export interface SelectThemeSectionProps {
  mode: SupportedColorScheme;
}

export default function SelectThemeSection({ mode }: SelectThemeSectionProps) {
  const customThemeDark = useAtomValue(customThemeDarkAtom);
  const customThemeLight = useAtomValue(customThemeLightAtom);

  const availThemes = useMemo(() => {
    return Object.keys(themes)
      .map((key) => {
        const tempTheme = getTheme({ name: key });

        if (!tempTheme) {
          return;
        }

        if (key === 'custom') {
          let theme = {
            ...tempTheme,
            colorSchemes: {
              dark: {
                palette: {
                  ...(customThemeDark?.palette as any),
                  ...tempTheme?.theme.colorSchemes.dark,
                },
              },
              light: {
                palette: {
                  ...(customThemeLight?.palette as any),
                  ...tempTheme?.theme.colorSchemes.light,
                },
              },
            },
          };

          return { ...{ theme, name: tempTheme.name }, key };
        }

        return { ...tempTheme, key };
      })
      .filter((e) => e !== undefined);
  }, [customThemeLight, customThemeDark]);

  const [props, meta, helpers] = useField('themeId');

  const handleSelect = (id: string) => {
    helpers.setValue(id);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {availThemes.map(
          (entry) =>
            entry && (
              <Grid item xs={12} sm={6} key={entry.key}>
                <WizardThemeButton
                  selected={props.value === entry.key}
                  name={entry.name}
                  id={entry.key}
                  onClick={handleSelect}
                  colors={{
                    primary:
                      entry.theme.colorSchemes[mode || ThemeMode.light].palette
                        .primary?.main,
                    background:
                      entry.theme.colorSchemes[mode || ThemeMode.light].palette
                        .background?.default,
                    secondary:
                      entry.theme.colorSchemes[mode || ThemeMode.light].palette
                        .secondary?.main,
                    text: entry.theme.colorSchemes[mode || ThemeMode.light]
                      .palette.text?.primary,
                  }}
                />
              </Grid>
            ),
        )}
      </Grid>
    </Box>
  );
}
