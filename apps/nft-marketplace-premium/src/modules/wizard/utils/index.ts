import { Token } from '../../../types/blockchain';
import { AppCollection } from '../../../types/config';
import { FeeForm } from '../components/sections/FeesSectionForm';
import { MAX_FEES } from '../constants';

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
