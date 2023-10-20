import { ThemeMode } from '@dexkit/ui/constants/enum';
import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { FormattedMessage } from 'react-intl';
import { getTheme, themes } from '../../../../theme';
import { customThemeDarkAtom, customThemeLightAtom } from '../../state';
import WizardThemeButton from '../WizardThemeButton';
import WizardThemeCustom from '../WizardThemeCustom';

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
  const customThemeDark = useAtomValue(customThemeDarkAtom);
  const customThemeLight = useAtomValue(customThemeLightAtom);
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
        <Grid item xs={6} sm={5} key={key}>
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

  return (
    <Grid container spacing={2}>
      {isMobile && (
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            justifyContent="space-between"
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="app.theme" defaultMessage="App Theme" />
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
        </Grid>
      )}

      {renderThemes()}
      <Grid item xs={12}>
        {selectedId === 'custom' && (
          <WizardThemeCustom mode={mode} legacyTheme={legacyTheme} />
        )}
      </Grid>
    </Grid>
  );
}
