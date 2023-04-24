import { Theme } from '@mui/material/styles';

import boredApeTheme from './themes/light/boredape';
import cryptoPunkTheme from './themes/light/cryptopunk';
import customTheme from './themes/light/custom';
import defaultTheme from './themes/light/index';
import kittygotchiTheme from './themes/light/kittygotchi';

import boredApeThemeDark from './themes/dark/boredape';
import cryptoPunkThemeDark from './themes/dark/cryptopunk';
import customThemeDark from './themes/dark/custom';
import defaultThemeDark from './themes/dark/index';
import kittygotchiThemeDark from './themes/dark/kittygotchi';

type ThemeEntry = { theme: Theme; name: string };

export const lightThemes: { [key: string]: ThemeEntry } = {
  'default-theme': { theme: defaultTheme, name: 'Default' },
  kittygotchi: { theme: kittygotchiTheme, name: 'Kittygotchi' },
  cryptopunk: { theme: cryptoPunkTheme, name: 'CryptoPunk' },
  boredape: { theme: boredApeTheme, name: 'BoredApe' },
  custom: { theme: customTheme, name: 'Custom' },
};

export const darkThemes: { [key: string]: ThemeEntry } = {
  'default-theme': { theme: defaultThemeDark, name: 'Default' },
  kittygotchi: { theme: kittygotchiThemeDark, name: 'Kittygotchi' },
  cryptopunk: { theme: cryptoPunkThemeDark, name: 'CryptoPunk' },
  boredape: { theme: boredApeThemeDark, name: 'BoredApe' },
  custom: { theme: customThemeDark, name: 'Custom' },
};

export function getTheme({ name, mode }: { name: string, mode?: 'light' | 'dark' }) {
  if (mode === 'dark') {
    return darkThemes[name]
  } else {
    return lightThemes[name]
  }
}
