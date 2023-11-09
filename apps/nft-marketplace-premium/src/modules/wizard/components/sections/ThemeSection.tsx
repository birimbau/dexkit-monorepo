import { ThemeMode } from '@dexkit/ui/constants/enum';
import {
  Box,
  Grid,
  Stack,
  SupportedColorScheme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { getTheme, themes } from '../../../../theme';
import {
  CustomThemeInterface,
  customThemeDarkAtom,
  customThemeLightAtom,
} from '../../state';
import { ThemeFormType } from '../../types';
import EditThemeForm from '../EditThemeForm';
import WizardThemeButton from '../WizardThemeButton';

interface Props {
  selectedId?: string;
  mode?: ThemeMode;
  legacyTheme?: string;
  onSelect: (id: string) => void;
  onPreview: () => void;
}

export default function ThemeSection({
  selectedId,
  mode,
  onSelect,
  legacyTheme,
  onPreview,
}: Props) {
  const theme = useTheme();

  const [customThemeLight, setCustomThemeLight] = useAtom(customThemeLightAtom);
  const [customThemeDark, setCustomThemeDark] = useAtom(customThemeDarkAtom);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderThemes = () => {
    return Object.keys(themes).map((key: string) => {
      const tempTheme = getTheme({ name: key });
      if (!tempTheme) {
        return;
      }
      let { theme, name } = tempTheme;
      if (key === 'custom') {
        theme = {
          ...theme,
          colorSchemes: {
            //@ts-ignore
            dark: {
              palette: {
                ...theme?.colorSchemes?.dark,
                ...(customThemeDark?.palette as any),
              },
            },
            //@ts-ignore
            light: {
              palette: {
                ...theme?.colorSchemes.light,
                ...(customThemeLight?.palette as any),
              },
            },
          },
        };
      }

      return (
        <Grid item xs={6} sm={4} key={key}>
          <WizardThemeButton
            selected={selectedId === key}
            name={name}
            id={key}
            onClick={onSelect}
            colors={{
              primary:
                theme.colorSchemes[mode || ThemeMode.light].palette.primary
                  .main,
              background:
                theme.colorSchemes[mode || ThemeMode.light].palette.background
                  .default,
              secondary:
                theme.colorSchemes[mode || ThemeMode.light].palette.secondary
                  .main,
              text: theme.colorSchemes[mode || ThemeMode.light].palette.text
                .primary,
            }}
          />
        </Grid>
      );
    });
  };

  const legacyThemeParsed = useMemo(() => {
    if (legacyTheme) {
      return JSON.parse(legacyTheme);
    }
  }, [legacyTheme]);

  const handleChange = useCallback(
    (values: ThemeFormType) => {
      if (selectedId !== undefined && selectedId !== values.themeId) {
        onSelect(values.themeId);
      }

      let data: CustomThemeInterface = {
        palette: {
          background: values.background
            ? { default: values.background }
            : undefined,
          primary: values.primary ? { main: values.primary } : undefined,
          secondary: values.secondary ? { main: values.secondary } : undefined,
          text: values.text ? { primary: values.text } : undefined,
        },
      };
      if (mode === ThemeMode.dark) {
        console.log('entra dark');
        setCustomThemeDark((value) => ({
          palette: {
            ...legacyThemeParsed?.palette,
            ...value?.palette,
            ...data.palette,
          },
        }));
      } else {
        console.log('entra light');
        setCustomThemeLight((value) => ({
          palette: {
            ...legacyThemeParsed?.palette,
            ...value?.palette,
            ...data.palette,
          },
        }));
      }
    },
    [mode, onSelect, legacyThemeParsed]
  );

  return (
    <>
      <Grid container spacing={2}>
        {isMobile && (
          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  <FormattedMessage
                    id="marketplace.theme"
                    defaultMessage="Marketplace Theme"
                  />
                </Typography>
                {/* <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={onPreview}
            >
              <FormattedMessage id="preview" defaultMessage="Preview" />
      </Button>*/}
              </Stack>
            </Box>
          </Grid>
        )}

        <EditThemeForm
          mode={mode as SupportedColorScheme}
          onChange={handleChange}
        />

        {/* {renderThemes()}
        <Grid item xs={12}>
          {selectedId === 'custom' && (
            <WizardThemeCustom mode={mode} legacyTheme={legacyTheme} />
          )}
        </Grid> */}
      </Grid>
    </>
  );
}
