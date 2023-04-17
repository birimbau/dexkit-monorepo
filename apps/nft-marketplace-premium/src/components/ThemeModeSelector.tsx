import { ThemeMode } from '@dexkit/ui/constants/enum';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useThemeMode } from 'src/hooks/app';
export function ThemeModeSelector() {
  const { mode, setThemeMode } = useThemeMode();

  return (
    <Stack direction={'row'} alignContent={'center'} alignItems={'center'}>
      <LightModeIcon />
      <Switch
        defaultChecked={mode === ThemeMode.dark}
        onChange={() => {
          if (mode === 'dark') {
            setThemeMode(ThemeMode.light);
          } else {
            setThemeMode(ThemeMode.dark);
          }
        }}
      />
      <DarkModeIcon />
    </Stack>
  );
}
