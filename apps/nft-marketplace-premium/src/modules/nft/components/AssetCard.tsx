import { useAssetMetadata } from '../../../hooks/nft';
import { Asset } from '../../../types/nft';
import { BaseAssetCard } from './BaseAssetCard';

interface Props {
  asset?: Asset;
  onFavorite?: (asset: Asset) => void;
  isFavorite?: boolean;
  onHide?: (asset: Asset) => void;
  isHidden?: boolean;
  showControls?: boolean;
  lazyLoadMetadata?: boolean;
  disabled?: boolean;
}

export function AssetCard({
  asset,
  onFavorite,
  isFavorite,
  onHide,
  isHidden,
  showControls,
  lazyLoadMetadata,
  disabled,
}: Props) {
  const { data: metadata } = useAssetMetadata(asset, {
    enabled: lazyLoadMetadata,
  });
  return (
    <BaseAssetCard
      onFavorite={onFavorite}
      isFavorite={isFavorite}
      disabled={disabled}
      asset={asset}
      onHide={onHide}
      isHidden={isHidden}
      showControls={showControls}
      assetMetadata={metadata}
    />
  );
}
