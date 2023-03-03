import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { getTheme } from 'src/theme';
import { Token } from '../../../types/blockchain';
import { AppCollection } from '../../../types/config';
import { FeeForm } from '../components/sections/FeesSectionForm';
import { MAX_FEES } from '../constants';
import { CustomThemeInterface } from '../state';

export function totalInFees(fees: FeeForm[]) {
  return fees.reduce((prev, current) => current.amountPercentage + prev, 0.0);
}

export function isBelowMaxFees(fees: FeeForm[], maxFee: number = MAX_FEES) {
  if (maxFee > 10 || maxFee < 0) {
    return false;
  }

  const total = totalInFees(fees);

  return total <= maxFee;
}

export function TOKEN_KEY(token: Token) {
  return `${token.chainId}-${token.address.toLowerCase()}`;
}

export function APP_COLLECTION_KEY(collection: AppCollection) {
  return `${collection.chainId}-${collection.contractAddress.toLowerCase()}`;
}




export function generateTheme({ selectedFont, selectedThemeId, customTheme }:
  { selectedFont?: { family?: string, category?: string }, selectedThemeId: string, customTheme?: CustomThemeInterface }) {

  let fontFamily;
  if (selectedFont) {
    fontFamily = `'${selectedFont.family}', ${selectedFont.category}`;
  }

  if (selectedThemeId === 'custom') {
    return responsiveFontSizes(
      fontFamily
        ? createTheme({
          ...customTheme,
          typography: {
            fontFamily,
          },
        })
        : createTheme(customTheme)
    );
  }
  const theme = getTheme(selectedThemeId).theme;
  return responsiveFontSizes(
    fontFamily
      ? createTheme({
        ...theme,
        typography: {
          fontFamily,
        },
      })
      : createTheme(theme)
  );


}