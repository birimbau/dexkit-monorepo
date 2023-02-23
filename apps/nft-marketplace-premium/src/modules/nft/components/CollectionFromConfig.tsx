import { useCollectionByApi } from '../../../hooks/nft';
import { Collection } from '../../../types/nft';
import CollectionCard from '../../home/components/CollectionCard';

interface Props {
  collection: Collection;
  variant?: 'default' | 'simple';
  totalSupply: number;
  title?: String;
  backgroundImageUrl?: string;
  hoverable?: boolean;
  disabled?: boolean;
}

export function CollectionFromConfigCard({
  collection,
  totalSupply,
  backgroundImageUrl,
  hoverable,
  title,
  variant,
  disabled,
}: Props) {
  return (
    <CollectionCard
      collection={collection}
      totalSupply={totalSupply}
      backgroundImageUrl={backgroundImageUrl}
      hoverable={hoverable}
      title={title}
      variant={variant}
      disabled={disabled}
    />
  );
}

export default CollectionFromConfigCard;
