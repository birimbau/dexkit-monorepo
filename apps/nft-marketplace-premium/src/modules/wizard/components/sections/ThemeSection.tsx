import { Visibility } from '@mui/icons-material';
import {
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { FormattedMessage } from 'react-intl';
import { getTheme, themes } from '../../../../theme';
import { customThemeAtom } from '../../state';
import WizardThemeButton from '../WizardThemeButton';
import WizardThemeCustom from '../WizardThemeCustom';

interface Props {
  selectedId?: string;
  onSelect: (id: string) => void;
  onPreview: () => void;
}

export default function ThemeSection({
  selectedId,
  onSelect,
  onPreview,
}: Props) {
  const theme = useTheme();
  const customTheme = useAtomValue(customThemeAtom);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderThemes = () => {
    return Object.keys(themes).map((key: string) => {
      const tempTheme = getTheme(key);
      if (!tempTheme) {
        return;
      }
      let { theme, name } = tempTheme;
      if (customTheme && key === 'custom') {
        theme = {
          ...theme,
          palette: {
            ...theme.palette,
            ...(customTheme.palette as any),
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
              primary: theme.palette.primary.main,
              background: theme.palette.background.default,
              secondary: theme.palette.secondary.main,
              text: theme.palette.text.primary,
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
        </Grid>
      )}

      {renderThemes()}
      <Grid item xs={12}>
        {selectedId === 'custom' && <WizardThemeCustom />}
      </Grid>
    </Grid>
  );
}
