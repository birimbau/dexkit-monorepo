import { Theme } from '@mui/material/styles';

import defaultTheme from './themes/index';
import kittygotchiTheme from './themes/kittygotchi';
import boredApeTheme from './themes/boredape';
import cryptoPunkTheme from './themes/cryptopunk';
import customTheme from './themes/custom';

type ThemeEntry = { theme: Theme; name: string };

export const themes: { [key: string]: ThemeEntry } = {
  'default-theme': { theme: defaultTheme, name: 'Default' },
  kittygotchi: { theme: kittygotchiTheme, name: 'Kittygotchi' },
  cryptopunk: { theme: cryptoPunkTheme, name: 'CryptoPunk' },
  boredape: { theme: boredApeTheme, name: 'BoredApe' },
  custom: { theme: customTheme, name: 'Custom' },
};

export function getTheme(name: string) {
  return themes[name];
}
