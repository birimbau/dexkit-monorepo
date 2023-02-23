import { ChainId } from '../../../constants/enum';
import { useFullAsset } from '../../../hooks/nft';
import { AssetCard } from './AssetCard';

interface Props {
  address: string;
  id: string;
  chainId?: ChainId;
  lazy?: boolean;
}

export function AssetCardWithData({ address, id, chainId, lazy }: Props) {
  const asset = useFullAsset({ address, id, chainId, lazy });
  return <AssetCard asset={asset} />;
}
