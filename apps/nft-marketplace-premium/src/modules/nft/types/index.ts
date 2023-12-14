import { Asset } from '@dexkit/core/types';
import { UseQueryOptions } from '@tanstack/react-query';

export type AssetOptions = {
  options?: Omit<UseQueryOptions<Asset>, any>;
};
