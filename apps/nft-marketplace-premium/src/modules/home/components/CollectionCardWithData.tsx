import { useCollection } from '../../../hooks/nft';
import CollectionCard from './CollectionCard';

interface Props {
  contractAddress?: string;
  chainId: number;
  title?: string;
  lazy?: boolean;
  backgroundImageUrl?: string;
  variant?: 'default' | 'simple';
}

export function CollectionCardWithData({
  contractAddress,
  chainId,
  title,
  backgroundImageUrl,
  variant,
  lazy,
}: Props) {
  const { data: collection, isError } = useCollection(
    contractAddress,
    chainId,
    lazy
  );

  return (
    <CollectionCard
      variant={variant}
      totalSupply={0}
      collection={collection}
      title={title}
      backgroundImageUrl={backgroundImageUrl}
    />
  );
}

export default CollectionCardWithData;
